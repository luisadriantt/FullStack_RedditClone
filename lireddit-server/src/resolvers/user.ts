import { MyContext } from "../types";
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";
import argon2 from "argon2"
import { COOKIE_NAME } from "../constants";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { validateRegister } from "../utils/validateRegister";

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
  // // Forgot password mutation
  // @Mutation(() => Boolean)
  // forgotPassword() {
  //   @Ctx() { req}: MyContext
  // }

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