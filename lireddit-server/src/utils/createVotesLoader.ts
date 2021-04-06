import { UserPost } from "../entities/UserPost";
import DataLoader from "dataloader";

// Dataloader: batch several request into a single sql statment
// [{postId: 5, userId: 10}]
// [{postId: 5, userId: 10, value: 1}]
export const createUpdootLoader = () =>
  new DataLoader<{ postId: number; userId: number }, UserPost | null>(
    async (keys) => {
      const updoots = await UserPost.findByIds(keys as any);
      const updootIdsToUpdoot: Record<string, UserPost> = {};
      updoots.forEach((updoot) => {
        updootIdsToUpdoot[`${updoot.userId}|${updoot.postId}`] = updoot;
      });

      return keys.map(
        (key) => updootIdsToUpdoot[`${key.userId}|${key.postId}`]
      );
    }
  );
