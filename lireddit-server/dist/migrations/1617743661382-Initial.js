"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Initial1617743661382 = void 0;
class Initial1617743661382 {
    constructor() {
        this.name = 'Initial1617743661382';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "user_post" ("value" integer NOT NULL, "userId" integer NOT NULL, "postId" integer NOT NULL, "user_id" integer, "post_id" integer, CONSTRAINT "PK_45cdc90ca0fd4cf0f8e8026e395" PRIMARY KEY ("userId", "postId"))`);
            yield queryRunner.query(`CREATE TABLE "user" ("_id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_457bfa3e35350a716846b03102d" PRIMARY KEY ("_id"))`);
            yield queryRunner.query(`CREATE TABLE "post" ("_id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "creatorId" integer NOT NULL, "text" character varying NOT NULL, "points" integer NOT NULL DEFAULT '0', "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "creator_id" integer, CONSTRAINT "PK_e4da8286ae74bb02b3856ec85a8" PRIMARY KEY ("_id"))`);
            yield queryRunner.query(`ALTER TABLE "user_post" ADD CONSTRAINT "FK_0597fe5ab2363ed386be0371720" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "user_post" ADD CONSTRAINT "FK_bfc00203f5eb4caa1c0ea94b002" FOREIGN KEY ("post_id") REFERENCES "post"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_cdb7a69f6107ba4227908d6ed55" FOREIGN KEY ("creator_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_cdb7a69f6107ba4227908d6ed55"`);
            yield queryRunner.query(`ALTER TABLE "user_post" DROP CONSTRAINT "FK_bfc00203f5eb4caa1c0ea94b002"`);
            yield queryRunner.query(`ALTER TABLE "user_post" DROP CONSTRAINT "FK_0597fe5ab2363ed386be0371720"`);
            yield queryRunner.query(`DROP TABLE "post"`);
            yield queryRunner.query(`DROP TABLE "user"`);
            yield queryRunner.query(`DROP TABLE "user_post"`);
        });
    }
}
exports.Initial1617743661382 = Initial1617743661382;
//# sourceMappingURL=1617743661382-Initial.js.map