import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

  @Field(() => String) // Graphql type
  @UpdateDateColumn()
  updatedAt: Date;

  @Field() // Graphql type
  @Column()
  title!: string;

}