import  { Browser, Page } from "puppeteer";
import puppeteer from 'puppeteer-extra';
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import {  ScrapeJobParams } from "./types";
import { getRandomUserAgent } from "./utils/helpers";
import pLimit from "p-limit";
import fs from "fs"
import { deleteFile, getImageAsBase64 } from "./utils/files";
import { zodResponseFormat } from "openai/helpers/zod";
import sharp from 'sharp';
import { z } from 'zod';
import { generateJsonFromImg } from "./utils/ai";

puppeteer.use(StealthPlugin());

const launchOpts = { 
    headless: false,
}

const ProfileReviewSchema = z.object({
  pinnedRepistories: z.array(z.object({
    name: z.string(),
    description: z.string(),
  })),
  techStacks: z.array(z.string()),
  isMatch: z.boolean(),
});

type ProfileReview = z.infer<typeof ProfileReviewSchema>;


export class ProfileReviewer {
    browser: Browser;

    constructor(browser: Browser) {
        this.browser = browser;
    }

    static readonly errors = {
        AI_RESPONSE: 'Invalid AI Response',
    }

    async run(githubUsername: string, criteria: string): Promise<ProfileReview | null> {
        const page = await this.browser.newPage();
        const PROFILES_DIR = 'profiles';
    
        if (!fs.existsSync(PROFILES_DIR)) {
            fs.mkdirSync(PROFILES_DIR);
        }
    
        try {
            await this.configurePage(page);
            const baseUrl = "https://github.com";
            const url = `${baseUrl}/${githubUsername}`;
            await page.goto(url, { waitUntil: 'networkidle2' });
    
            const profilePath = `${PROFILES_DIR}/profile-${githubUsername}.png`;
            await page.screenshot({ type: 'png', path: profilePath });    
            await page.close();
    
            // Process the screenshot separately
            return await this.reviewProfile(profilePath, criteria);
        } catch (error: any) {
            console.error('Reviewer error', { githubUsername, details: error?.message || '' });
            return null;
        } finally {
            if (!page.isClosed()) {
                await page.close();
            }
        }
    }
    

    profileReviewPrompt (criteria: string){
        return  `
        ## Criteria
    
        ${criteria}
    
        ## Task
    
        Analyse and review the candidates github profile provided in the image and determine if the profile is a match based on the job criteria.
        `
    }

    private async reviewProfile(profilePath: string, criteria: string): Promise<ProfileReview> {
        try{
            // Optionally resize image first

            // await sharp(originalFilePath)
            //     .resize(990, 990, { fit: 'cover' })
            //     .toFile(resizedFilePath);
        
            const base64 = getImageAsBase64(profilePath);
            const prompt = this.profileReviewPrompt(criteria);
            const res = await generateJsonFromImg(prompt, {
                imageUrl: base64,
                responseFormat: zodResponseFormat(ProfileReviewSchema, "profile_review"),
            }) as unknown as ProfileReview | null;
        
            if (!res || typeof (res?.isMatch) !== 'boolean') throw new Error(ProfileReviewer.errors.AI_RESPONSE);
            return res; 
        } finally {
            await Promise.all([
                deleteFile(profilePath),
            ])
        }
    }

    private async configurePage(page: Page) {
        await Promise.all([
            page.setUserAgent(getRandomUserAgent()), 
        ]);
    }
}

export async function review({githubUsername, criteria}: {githubUsername: string, criteria: string}) {
    const browser = await puppeteer.launch(launchOpts);
    try {
        const reviewer = new ProfileReviewer(browser);
        const result = await reviewer.run(githubUsername, criteria);
        console.log(result)
    } finally {
        await browser.close();
    }
}