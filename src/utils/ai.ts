import dotenv from 'dotenv'
import OpenAI from "openai";
import { GenerateJSONParams, GenerateTextFromImageParams } from "../types";

dotenv.config()

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
const defaultSystemPrompt = "You are a helpful assistant."

export async function generateJsonFromImg(prompt: string, chatOptions: GenerateJSONParams & GenerateTextFromImageParams) {
    const {systemPrompt, opts, responseFormat, chatHistory, imageUrl} = chatOptions
    const {model='gpt-4o', ...otherOpts} = opts || {};
    const response = await openai.beta.chat.completions.parse({
        messages: [
            {
                "role": "system", 
                "content": systemPrompt || defaultSystemPrompt 
            },
            ...chatHistory || [],
            {
                role: "user",
                content: [
                    {type: "text", text: prompt },
                    {type: "image_url", image_url: {url: imageUrl, detail: 'high'}}
                ]},
        ],
        response_format: responseFormat,
        model,
        ...otherOpts
        
    });
    return response.choices[0].message.parsed;
}
