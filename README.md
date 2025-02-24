# **GitHub Profile Reviewer**  

🚀 **GitHub Profile Reviewer** is a tool that helps recruiters automate the analysis of a candidate's GitHub profile. It captures a candidate’s GitHub profile, processes key insights, and evaluates them based on predefined job criteria.  

## **Table of Contents**  
- [Installation](#installation)  
- [Usage](#usage)  
- [Example Output](#example-output)  

## **Installation**  

1. **Clone the repository**  
   ```sh
   git clone https://github.com/dev-diaries41/github-profile-reviewer.git
   cd github-profile-reviewer
   ```

2. **Install dependencies**  
   ```sh
   npm install
   ```


## **Usage**  

You can use the tool by calling the `review` or `reviewBatch` functions as shown below:  

```typescript
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
```

## **Example Output**  

```json
{
  "pinnedRepistories": [
    {
      "name": "waydroid-frida-starter-kit",
      "description": "A starter kit for pentesting android apps with frida and waydroid"
    },
    {
      "name": "termux-plugin-cli",
      "description": "A cli tool to manage termux-plugins"
    },
    {
      "name": "termux-plugins",
      "description": "A collection of plugins for termux"
    },
    {
      "name": "simiverse",
      "description": "Simiverse is a cross platform simulation framework for building and integrating simulations across multiple platforms"
    },
    {
      "name": "simiverse-web",
      "description": "Simiverse web-client for running interactive LLM based simulations"
    },
    {
      "name": "chartwise-app",
      "description": "A LLM based analysis tool for traders"
    }
  ],
  "techStacks": [ "JavaScript", "TypeScript", "Shell" ],
  "isMatch": true
}
```
