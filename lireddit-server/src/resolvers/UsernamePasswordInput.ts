import { Field, InputType } from "type-graphql";
// For arguments
@InputType()
export class UsernamePasswordInput {
  @Field()
  email: string;
  @Field()
  username: string;
  @Field()
  password: string;
}
