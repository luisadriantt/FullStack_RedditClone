import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from "express"
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import redis from "redis"
import session from "express-session"
import connectRedis from "connect-redis"
import { MyContext } from "./types";


const main = async () => {
  // MickroORM config

  const orm = await MikroORM.init(microConfig)
  await orm.getMigrator().up(); // run the migration before anything else (create table)

  // App config
  const app = express()

  const RedisStore = connectRedis(session)
  const redisClient = redis.createClient()

  // Session cookies with redis
  app.use(
    session({
      name: 'quid',
      store: new RedisStore({
        client: redisClient,
        disableTouch: true, // Keeps session open forever
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true, // Wont allow coockie access to front end 
        sameSite: 'lax', //csrf
        secure: __prod__ // cookie will only works in https
      },
      secret: "e12",
      resave: false,
      saveUninitialized: false
    })
  )

  // Graphql Server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false
    }),
    // Function pased as context to resolvers 
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }) // pass session with req, res
  })

  // Middlewares
  apolloServer.applyMiddleware({ app })

  // Listener
  app.listen(4000, () => {
    console.log("server started on localhost:4000")
  })

  // insert into table
  // const post = orm.em.create(Post, {title: ' first post'})
  // await orm.em.persistAndFlush(post)

  // const posts = await orm.em.find(Post, {}) // returns all records from table post
  // console.log(posts)
}

main().catch(err => console.log(err))