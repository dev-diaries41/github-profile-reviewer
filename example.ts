import { review, reviewBatch, ProfileReviewer } from "./src";
import dotenv from "dotenv";
dotenv.config();

(async() => {
    const openaiApiKey = process.env.OPENAI_API_KEY!;
    const criteria = "A full stack developer with experience building scalable web apps using typescript/javascript";

    // Single profile review
    const githubUsername = "dev-diaries41";
    const singleReview = await review(githubUsername, criteria, openaiApiKey)
    console.log("Single Profile Review:", singleReview);

    // Batch profile review
    const githubUsernames = ["dev-diaries41", "janeDoe", "johnSmith"];
    const batchReview = await reviewBatch(githubUsernames, criteria, openaiApiKey, 2); // Concurrency set to 2
    console.log("Batch Profile Reviews:", batchReview);
})();