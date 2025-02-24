import { ResponseFormatJSONSchema } from "openai/resources";
import { ChatCompletionCreateParamsBase, ChatCompletionMessageParam } from "openai/resources/chat/completions";


export interface ScrapeJobParams  {
    url: string, 
    maxResults?: number, 
    webhookUrl?: string
  }

  // OPENAI

export interface OpenaiChatParams {
    systemPrompt?: string;
    opts?:  Omit<Partial<ChatCompletionCreateParamsBase>, 'stream'>;
    chatHistory?: ChatCompletionMessageParam[]
}

export interface GenerateTextFromImageParams extends OpenaiChatParams {
    imageUrl: string
}

export interface GenerateTextFromImagesParams extends OpenaiChatParams {
    imageUrls: string[]
}

export interface GenerateJSONParams extends  OpenaiChatParams{
    responseFormat: ResponseFormatJSONSchema;
    opts?: Omit<Partial<ChatCompletionCreateParamsBase>, 'stream'>;
}

export interface ReviewParams { 
    githubUsername: string, 
    criteria: string, 
    openaiApiKey: string 
}