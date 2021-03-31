import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from "path"
import { User } from "./entities/User";

// migration cli command: npx mikro-orm migration:create
export default {
  migrations: {
    path: path.join(__dirname, './migrations'), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files ts or js
  },
  entities: [Post, User],
  dbName: 'lireddit',
  type: 'postgresql',
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
// parameters gives the parameters of the type return an array,
// we want the first parameters
// cast to MikroORM type so each object is its onw type