import { Migration } from '@mikro-orm/migrations';

export class Migration20210401154507 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
  }

}
