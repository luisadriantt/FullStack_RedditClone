import { Request, Response } from "express";
import { Session, SessionData } from "express-session";
import Redis from "ioredis";
import { createUserLoader } from "./utils/createUserLoader";
import { createVotesLoader } from "./utils/createVotesLoader";

// create type alias for context
export type MyContext = {
  req: Request & {
    session: Session & Partial<SessionData> & { userId?: number };
  };
  res: Response;
  redis: Redis.Redis;
  userLoader: ReturnType<typeof createUserLoader>;
  votesLoader: ReturnType<typeof createVotesLoader>;
};
