import { UserPost } from "../entities/UserPost";
import DataLoader from "dataloader";

// Dataloader: batch several request into a single sql statment
// [{postId: 5, userId: 10}]
// [{postId: 5, userId: 10, value: 1}]
export const createVotesLoader = () =>
  new DataLoader<{ postId: number; userId: number }, UserPost | null>(
    async (keys) => {
      const votes = await UserPost.findByIds(keys as any);
      const voteIdsToVote: Record<string, UserPost> = {};
      votes.forEach((vote) => {
        voteIdsToVote[`${vote.userId}|${vote.postId}`] = vote;
      });

      return keys.map((key) => voteIdsToVote[`${key.userId}|${key.postId}`]);
    }
  );
