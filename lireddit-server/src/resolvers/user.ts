import { MyContext } from "../types";
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";
import argon2 from "argon2"
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { v4 } from "uuid";

@ObjectType()
class FieldError {
  @Field()
  field: string
  @Field()
  message: string
}

// For mutation
@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User

}

// CRUD to mikroorm through graphql
@Resolver()
export class UserResolver {
  // Chande password mutation
  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis, em, req }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 2) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "length must be greater than 2",
          },
        ],
      };
    }

    const key = FORGET_PASSWORD_PREFIX + token
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }
    const userIdNum = parseInt(userId);
    const user = await em.findOne(User, { _id: userIdNum });

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }
    user.password = await argon2.hash(newPassword)
    await em.persistAndFlush(user);

    await redis.del(key)

    //log the user after changing the pass
    req.session.userId = user._id

    return { user }
  }

  // Forgot password mutation
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { em, redis }: MyContext) {
    const user = await em.findOne(User, { email })
    if (!user) {
      return true
    }
    const token = v4()

    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user._id,
      'ex', 1000 * 60 * 60 * 24 * 3) // token for changing the pass valid up to 3 days

    await sendEmail(
      email,
      `<a href="http://localhost:3000/change-password/${token}">reset password</a>`,
      'Reset password'
    )

    return true;
  }


  // Check if user is logged from the cookie and fetch it
  @Query(() => User, { nullable: true })
  async me(
    @Ctx() { req, em }: MyContext
  ) {
    if (!req.session.userId) {
      return null
    }
    const user = await em.findOne(User, { _id: req.session.userId })
    return user
  }
  // Register an user
  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext): Promise<UserResponse> {

    const errors = validateRegister(options)
    if (errors) {
      return { errors }
    }


    const hashedPassword = await argon2.hash(options.password)
    const user = em.create(User, {
      email: options.email,
      username: options.username,
      password: hashedPassword
    })
    try {
      await em.persistAndFlush(user);
    } catch (err) {
      // duplicate username error
      if (err.code === '23505') {
        return {
          errors: [
            {
              field: 'username',
              message: 'username alerady exists'
            }
          ]
        }
      }
    }
    // loggin the user at register
    // set a cookie on the user
    req.session.userId = user._id
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() { em, req }: MyContext): Promise<UserResponse> {
    const user = await em.findOne(User,
      usernameOrEmail.includes('@')
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail })
    if (!user) {
      return {
        errors: [{
          field: 'usernameOrEmail',
          message: 'user does not exist'
        }]
      }
    }
    const valid = await argon2.verify(user.password, password)
    if (!valid) {
      return {
        errors: [{
          field: 'password',
          message: 'incorrect password'
        }]
      }
    }

    req.session.userId = user._id

    return {
      user,
    }
  }

  @Mutation(() => Boolean)
  logout(
    @Ctx() { req, res }: MyContext
  ) {
    return new Promise(resolve => req.session.destroy(err => {
      res.clearCookie(COOKIE_NAME)
      if (err) {
        console.log(err)
        resolve(false)
        return
      }
      resolve(true)
    }))
  }
}