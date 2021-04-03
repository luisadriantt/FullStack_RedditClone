import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

// Setting up table
@ObjectType() // This decorator converts to a graphql type
@Entity()
export class Post extends BaseEntity {
  @Field() // Graphql type (exposes to Graphql)
  @PrimaryGeneratedColumn()
  _id!: number;

  @Field(() => String) // Graphql type
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @Column()
  creatorId: number;

  @Field() // Graphql type
  @Column()
  text!: string;

  @Field() // Graphql type
  @Column({ type: "int", default: 0 })
  points!: number;

  @Field()
  @ManyToOne(() => User, (user) => user.posts)
  creator: User;

  @Field(() => String) // Graphql type
  @UpdateDateColumn()
  updatedAt: Date;

  @Field() // Graphql type
  @Column()
  title!: string;
}
