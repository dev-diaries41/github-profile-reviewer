# **GitHub Profile Reviewer**  

🚀 **GitHub Profile Reviewer** is a tool that helps recruiters automate the analysis of a candidate's GitHub profile. It captures a candidate’s GitHub profile, processes key insights, and evaluates them based on predefined job criteria.  

## **Table of Contents**  
- [Installation](#installation)  
- [Usage](#usage)  
- [Configuration](#configuration)  
- [How It Works](#how-it-works)  
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

You can use the tool by calling the `review` function as shown below:  

```typescript
import { review } from "./src";

(async () => {
    const githubUsername = "dev-diaries41";
    const criteria = "A full stack developer with experience building scalable web apps using TypeScript/JavaScript";

    await review({ githubUsername, criteria });
})();
```

## **Configuration**  

- **GitHub Username**: The username of the candidate whose profile will be analyzed.  
- **Criteria**: The job requirements that the candidate’s profile will be evaluated against.  

## **How It Works**  

1. Opens a Puppeteer browser session.  
2. Navigates to the candidate"s GitHub profile.  
3. Captures relevant data (e.g., pinned repositories, tech stack).  
4. Analyzes the profile based on the provided job criteria.  
5. Returns a structured summary candidate’s suitability.  

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
