import DataLoader from "dataloader";
import { User } from "../entities/User";

// keys (user id): [1, 78, 8, 9]
// user for each key: [{id: 1, username: 'tim'}, {}, {}, {}]
export const createUserLoader = () =>
  new DataLoader<number, User>(async (userIds) => {
    const users = await User.findByIds(userIds as number[]);
    const userIdToUser: Record<number, User> = {};
    users.forEach((u) => {
      userIdToUser[u._id] = u;
    });

    const sortedUsers = userIds.map((userId) => userIdToUser[userId]);
    return sortedUsers;
  });
