import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

// Setting up table
@ObjectType() // This decorator converts to a graphql type
@Entity()
export class Post {
  @Field() // Graphql type (exposes to Graphql)
  @PrimaryKey()
  _id!: number;

  @Field(() => String) // Graphql type
  @Property({type: "date"})
  createdAt = new Date();

  @Field(() => String) // Graphql type
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field() // Graphql type
  @Property({type: "text"})
  title!: string;

}