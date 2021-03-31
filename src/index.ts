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

const main = async () => {
  // MickroORM config
  const orm = await MikroORM.init(microConfig)
  await orm.getMigrator().up(); // run the migration before anything else (create table)

  // App config
  const app = express()

  // Graphql Server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false
    }),
    context: () => ({ em: orm.em }) // Function pased as ctx to resolvers 
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