import { review } from "./src";

(async() => {
    const githubUsername = "dev-diaries41";
    const criteria = "A full stack developer with experience building scalable web apps using typescript/javascript"
    await review({githubUsername, criteria})
})();