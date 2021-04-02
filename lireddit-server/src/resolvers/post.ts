import { Post } from "../entities/Post";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

// CRUD to mikroorm through graphql
@Resolver()
export class PostResolver {
  // Return all posts
  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return Post.find()
  }

  // Returns a post or null
  @Query(() => Post, { nullable: true })
  post(
    @Arg("id") id: number,
  ): Promise<Post | undefined> {
    return Post.findOne(id)
  }

  // Create post
  @Mutation(() => Post)
  async createPost(
    @Arg("title") title: string,
  ): Promise<Post> {
    return Post.create({ title }).save()
  }

  // Update post
  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
  ): Promise<Post | null> {
    const post = await Post.findOne(id)
    if (!post) {
      return null
    }
    if (typeof title !== "undefined") {
      await Post.update({ _id: id }, { title })
    }
    return post
  }

  // Deletes a post
  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id") id: number,
  ): Promise<Boolean> {
    await Post.delete(id)
    return true
  }
}