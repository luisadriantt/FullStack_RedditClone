import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1617743661382 implements MigrationInterface {
    name = 'Initial1617743661382'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_post" ("value" integer NOT NULL, "userId" integer NOT NULL, "postId" integer NOT NULL, "user_id" integer, "post_id" integer, CONSTRAINT "PK_45cdc90ca0fd4cf0f8e8026e395" PRIMARY KEY ("userId", "postId"))`);
        await queryRunner.query(`CREATE TABLE "user" ("_id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_457bfa3e35350a716846b03102d" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE TABLE "post" ("_id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "creatorId" integer NOT NULL, "text" character varying NOT NULL, "points" integer NOT NULL DEFAULT '0', "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "creator_id" integer, CONSTRAINT "PK_e4da8286ae74bb02b3856ec85a8" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`ALTER TABLE "user_post" ADD CONSTRAINT "FK_0597fe5ab2363ed386be0371720" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_post" ADD CONSTRAINT "FK_bfc00203f5eb4caa1c0ea94b002" FOREIGN KEY ("post_id") REFERENCES "post"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_cdb7a69f6107ba4227908d6ed55" FOREIGN KEY ("creator_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_cdb7a69f6107ba4227908d6ed55"`);
        await queryRunner.query(`ALTER TABLE "user_post" DROP CONSTRAINT "FK_bfc00203f5eb4caa1c0ea94b002"`);
        await queryRunner.query(`ALTER TABLE "user_post" DROP CONSTRAINT "FK_0597fe5ab2363ed386be0371720"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_post"`);
    }

}
