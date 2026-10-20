import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "payload"."payload_admins" ADD COLUMN "totp_pending_secret" varchar;
  ALTER TABLE "payload"."payload_admins" ADD COLUMN "totp_last_counter" numeric;`);
}

export async function down({
	db,
	payload,
	req
}: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "payload"."payload_admins" DROP COLUMN "totp_pending_secret";
  ALTER TABLE "payload"."payload_admins" DROP COLUMN "totp_last_counter";`);
}
