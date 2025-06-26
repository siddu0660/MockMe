import { LeetCode } from "leetcode-query";

const leetcode = new LeetCode();

export async function getData(username: string) {
    try {
        const user = await leetcode.user(username);
        if (!user || !user.matchedUser) {
            throw new Error("User not found");
        }
        const stats = user.matchedUser.submitStats.acSubmissionNum;
        return {
            username: user.matchedUser.username,
            totalSolved: stats[0]?.count ?? 0,
            easySolved: stats[1]?.count ?? 0,
            mediumSolved: stats[2]?.count ?? 0,
            hardSolved: stats[3]?.count ?? 0,
            recentSubmissions: user.recentSubmissionList,
            ranking: user.matchedUser.profile.ranking,
        };
    } catch (err) {
        return undefined;
    }
}