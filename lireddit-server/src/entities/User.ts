import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Post } from "./Post";

// Setting up User table
@ObjectType() // This decorator converts to a graphql type
@Entity()
export class User extends BaseEntity {
  @Field() // Graphql type (exposes to Graphql)
  @PrimaryGeneratedColumn()
  _id!: number;

  @Field(() => String) // Graphql type
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String) // Graphql type
  @UpdateDateColumn()
  updatedAt: Date;

  @Field() // Graphql type
  @Column({ unique: true })
  username!: string;

  @Field() // Graphql type
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[];
}
