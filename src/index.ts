import OpenAI from "openai";
import { GenerateJSONParams, GenerateTextFromImageParams, ReviewParams } from "./types";
import { Browser, LaunchOptions, Page } from "puppeteer";
import puppeteer from 'puppeteer-extra';
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { getRandomUserAgent } from "./utils/helpers";
import pLimit from "p-limit";
import fs from "fs"
import { deleteFile, getImageAsBase64 } from "./utils/files";
import { zodResponseFormat } from "openai/helpers/zod";
import sharp from 'sharp';
import { z } from 'zod';

puppeteer.use(StealthPlugin());

const launchOpts: LaunchOptions = { 
    headless: false,
};

const defaultSystemPrompt = "You are a helpful assistant.";

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
    openai: OpenAI;

    // The constructor now requires the OpenAI API key
    constructor(browser: Browser, openaiApiKey: string) {
        this.browser = browser;
        this.openai = new OpenAI({ apiKey: openaiApiKey });
    }

    static readonly errors = {
        INVALID_API_KEY: "Invalid OpenAI API Key",
        AI_RESPONSE: 'Invalid AI Response',
    };

    async runBatch(githubUsernames: string[], criteria: string, concurrency: number = 1) {
        const limit = pLimit(concurrency);
        return await Promise.all(
            githubUsernames.map((githubUsername) => limit(() => this.run(githubUsername, criteria)))
        );
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

    profileReviewPrompt(criteria: string) {
        return `
        ## Criteria

        ${criteria}

        ## Task

        Analyse and review the candidate's GitHub profile provided in the image and determine if the profile is a match based on the job criteria.
        `;
    }

    private async generateJsonFromImg(prompt: string, chatOptions: GenerateJSONParams & GenerateTextFromImageParams) {
        const { systemPrompt, opts, responseFormat, chatHistory, imageUrl } = chatOptions;
        const { model = 'gpt-4o', ...otherOpts } = opts || {};
        const response = await this.openai.beta.chat.completions.parse({
            messages: [
                { role: "system", content: systemPrompt || defaultSystemPrompt },
                ...(chatHistory || []),
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt },
                        { type: "image_url", image_url: { url: imageUrl, detail: 'high' } }
                    ]
                },
            ],
            response_format: responseFormat,
            model,
            ...otherOpts
        });
        return response.choices[0].message.parsed;
    }

    private async reviewProfile(profilePath: string, criteria: string): Promise<ProfileReview> {
        try {
            const base64 = getImageAsBase64(profilePath);
            const prompt = this.profileReviewPrompt(criteria);
            const res = await this.generateJsonFromImg(prompt, {
                imageUrl: base64,
                responseFormat: zodResponseFormat(ProfileReviewSchema, "profile_review"),
            }) as unknown as ProfileReview | null;
        
            if (!res || typeof res?.isMatch !== 'boolean') throw new Error(ProfileReviewer.errors.AI_RESPONSE);
            return res; 
        } finally {
            await deleteFile(profilePath);
        }
    }

    private async configurePage(page: Page) {
        await Promise.all([
            page.setUserAgent(getRandomUserAgent()), 
        ]);
    }
}

export async function review(githubUsername: string, criteria: string, openaiApiKey: string ): Promise<ProfileReview |null> {
    const browser = await puppeteer.launch(launchOpts);
    try {
        if (!openaiApiKey) throw new Error(ProfileReviewer.errors.INVALID_API_KEY);
        
        const reviewer = new ProfileReviewer(browser, openaiApiKey);
        return await reviewer.run(githubUsername, criteria);
    } finally {
        await browser.close();
    }
}

export async function reviewBatch(githubUsernames: string[], criteria: string, openaiApiKey: string, concurrency?: number ): Promise<(ProfileReview |null)[]> {
    const browser = await puppeteer.launch(launchOpts);
    try {
        if (!openaiApiKey) throw new Error(ProfileReviewer.errors.INVALID_API_KEY);
        
        const reviewer = new ProfileReviewer(browser, openaiApiKey);
        return await reviewer.runBatch(githubUsernames, criteria, concurrency);
    } finally {
        await browser.close();
    }
}

