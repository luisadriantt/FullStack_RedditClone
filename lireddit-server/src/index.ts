import "reflect-metadata";
import { COOKIE_NAME, __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";
import cors from "cors";
import { createConnection } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import path from "path";

const main = async () => {
  // Typeorm conf
  const conn = await createConnection({
    type: "postgres",
    database: "lireddit2",
    username: "postgres",
    password: "postgres",
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, User],
  });

  await conn.runMigrations();

  // await Post.delete({});

  // App config
  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  // Session cookies with redis
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true, // Keeps session open forever
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true, // Wont allow coockie access to front end
        sameSite: "lax", //csrf
        secure: __prod__, // cookie will only works in https
      },
      secret: "e12",
      resave: false,
      saveUninitialized: false,
    })
  );

  // Graphql Server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    // Function pased as context to resolvers
    context: ({ req, res }): MyContext => ({ req, res, redis }), // pass session with req, res
  });

  // apollo midelware
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  // Listener
  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });

  // insert into table
  // const post = orm.em.create(Post, {title: ' first post'})
  // await orm.em.persistAndFlush(post)

  // const posts = await orm.em.find(Post, {}) // returns all records from table post
  // console.log(posts)
};

main().catch((err) => console.log(err));
