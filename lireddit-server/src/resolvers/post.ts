import { Post } from "../entities/Post";
import { User } from "../entities/User";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { MyContext } from "../types";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";
import { UserPost } from "../entities/UserPost";

@InputType()
class PostInput {
  @Field()
  title: string;

  @Field()
  text: string;
}
@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}

// CRUD
@Resolver(Post)
export class PostResolver {
  // Vote mutation
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const isUpdoot = value !== -1;
    const realValue = isUpdoot ? 1 : -1;
    const { userId } = req.session;
    // await Updoot.insert({
    //   userId,
    //   postId,
    //   value: realValue,
    // });
    const updoot = await UserPost.findOne({ where: { postId, userId } });
    // the user has voted on the post before
    // and they are changing their vote
    if (updoot && updoot.value !== realValue) {
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
            update user_post
            set value = $1
            where "postId" = $2 and "userId" = $3
        `,
          [realValue, postId, userId]
        );

        await tm.query(
          `
            update post
            set points = points + $1
            where _id = $2
        `,
          [2 * realValue, postId]
        );
      });
    } else if (!updoot) {
      // has never voted before
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
            insert into user_post ("userId", "postId", value)
            values ($1, $2, $3)
        `,
          [userId, postId, realValue]
        );

        await tm.query(
          `
            update post
            set points = points + $1
            where _id = $2
      `,
          [realValue, postId]
        );
      });
    }
    return true;
  }

  // Return only 50 firts characters of post text
  @FieldResolver(() => String)
  textSnippet(@Root() post: Post) {
    return post.text.slice(0, 50);
  }
  // Return all posts
  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
    @Ctx() { req }: MyContext
  ): Promise<PaginatedPosts> {
    // 20 -> 21
    const realLimit = Math.min(50, limit);
    const reaLimitPlusOne = realLimit + 1;

    // const qb = getConnection()
    //   .getRepository(Post)
    //   .createQueryBuilder("p")
    //   .innerJoinAndSelect("p.creator", "u", 'u.id = p."creatorId"')
    //   .orderBy('p."createdAt"', "DESC")
    //   .take(reaLimitPlusOne);

    // if (cursor) {
    //   qb.where('p."createdAt" < :cursor', {
    //     cursor: new Date(parseInt(cursor)),
    //   });
    // }

    const replacements: any[] = [reaLimitPlusOne];

    if (req.session.userId) {
      replacements.push(req.session.userId);
    }

    let cursorIdx = 3;
    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
      cursorIdx = replacements.length;
    }

    // Raw query
    const posts = await getConnection().query(
      `
    select p.*,
    json_build_object(
      '_id', u._id,
      'username', u.username,
      'email', u.email,
      'createdAt', u."createdAt",
      'updatedAt', u."updatedAt"
      ) creator,
    ${
      req.session.userId
        ? '(select value from user_post where "userId" = $2 and "postId" = p._id) "voteStatus"'
        : 'null as "voteStatus"'
    }
    from post p
    inner join public.user u on u._id = p."creatorId"
    ${cursor ? `where p."createdAt" < $${cursorIdx}` : ""}
    order by p."createdAt" DESC
    limit $1
    `,
      replacements
    );

    // const posts = await qb.getMany();

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === reaLimitPlusOne,
    };
  }

  // Returns a post or null
  @Query(() => Post, { nullable: true })
  async post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return await Post.findOne(id, { relations: ["creator"] });
  }

  // Create post
  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Arg("creator", () => Int) creator: number,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    const user = await User.findOne(creator);
    return Post.create({
      ...input,
      creatorId: req.session.userId,
      creator: user,
    }).save();
  }

  // Update post
  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string
  ): Promise<Post | null> {
    const post = await Post.findOne({ _id: id });
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      await Post.update({ _id: id }, { title });
    }
    return post;
  }

  // Deletes a post
  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: number): Promise<Boolean> {
    await Post.delete({ _id: id });
    return true;
  }
}
