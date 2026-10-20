import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	// Schéma dédié à Payload (cf. schemaName dans payload.config.ts) : non créé par la migration générée
	await db.execute(sql`CREATE SCHEMA IF NOT EXISTS "payload";`);
	await db.execute(sql`
   CREATE TYPE "payload"."enum_payload_indicators_slug" AS ENUM('online', 'satisfaction', 'handicap', 'dlnuf', 'usage', 'simplicity', 'help_reachable', 'help_efficient', 'help_used', 'uptime', 'performance', 'auth');
  CREATE TYPE "payload"."enum_payload_indicators_icon" AS ENUM('ri-emoji-sticker-line', 'ri-mac-line', 'ri-device-line', 'ri-rest-time-line', 'ri-customer-service-line', 'ri-shield-user-line', 'ri-timer-flash-line', 'ri-timer-line', 'ri-pass-valid-line', 'ri-open-arm-line', 'ri-speak-line', 'ri-chat-smile-line', 'ri-user-line', 'ri-signal-tower-line', 'ri-lock-unlock-line');
  CREATE TYPE "payload"."enum_payload_indicator_levels_color" AS ENUM('green', 'yellow', 'red', 'blue', 'gray', 'orange');
  CREATE TABLE "payload"."payload_admins_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "payload"."payload_admins" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"totp_secret" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."payload_media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload"."payload_indicators" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" "payload"."enum_payload_indicators_slug" NOT NULL,
  	"label" varchar NOT NULL,
  	"description" varchar,
  	"description_radar" varchar,
  	"description_header" varchar,
  	"description_obj" jsonb,
  	"description_html" varchar,
  	"icon" "payload"."enum_payload_indicators_icon" NOT NULL,
  	"position" numeric NOT NULL,
  	"more_infos_title" varchar,
  	"more_infos" varchar,
  	"threshold_max" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_indicators_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"payload_versions_id" integer
  );
  
  CREATE TABLE "payload"."payload_indicator_levels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"label_stats" varchar,
  	"color" "payload"."enum_payload_indicator_levels_color" DEFAULT 'gray' NOT NULL,
  	"description" varchar NOT NULL,
  	"indicator_id" integer NOT NULL,
  	"position" numeric NOT NULL,
  	"threshold" numeric,
  	"no_background" boolean,
  	"goal_reached" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_versions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"number" numeric NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload"."payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"payload_admins_id" integer,
  	"payload_media_id" integer,
  	"payload_indicators_id" integer,
  	"payload_indicator_levels_id" integer,
  	"payload_versions_id" integer
  );
  
  CREATE TABLE "payload"."payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"payload_admins_id" integer
  );
  
  CREATE TABLE "payload"."payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."home_quality_blocs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"button_text" varchar NOT NULL,
  	"button_link" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."home_redirections_texts_with_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"button_text" varchar NOT NULL,
  	"button_link" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"header_title" varchar NOT NULL,
  	"header_description" varchar NOT NULL,
  	"header_button_text" varchar NOT NULL,
  	"header_button_link" varchar NOT NULL,
  	"quality_title" varchar NOT NULL,
  	"quality_description" varchar NOT NULL,
  	"indicators_title" varchar NOT NULL,
  	"indicators_description" varchar NOT NULL,
  	"indicators_button_text" varchar NOT NULL,
  	"indicators_button_link" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."help_key_indicators_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"indicator_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."help_additionnal_indicators_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"indicator_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."help" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"header_title" varchar NOT NULL,
  	"goals_title" varchar NOT NULL,
  	"goals_wysiwyg" jsonb,
  	"goals_wysiwyg_html" varchar,
  	"criterias_title" varchar NOT NULL,
  	"criterias_wysiwyg" jsonb,
  	"criterias_wysiwyg_html" varchar,
  	"indicators_title" varchar NOT NULL,
  	"indicators_key_indicators_key_indicators_title" varchar NOT NULL,
  	"indicators_key_indicators_key_indicators_description" varchar,
  	"indicators_additionnal_indicators_additionnal_indicators_title" varchar NOT NULL,
  	"indicators_additionnal_indicators_additionnal_indicators_description" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."legals" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"legal_a11y_title" varchar NOT NULL,
  	"legal_a11y_wysiwyg" jsonb,
  	"legal_a11y_wysiwyg_html" varchar,
  	"legal_mentions_title" varchar NOT NULL,
  	"legal_mentions_wysiwyg" jsonb,
  	"legal_mentions_wysiwyg_html" varchar,
  	"legal_pc_title" varchar NOT NULL,
  	"legal_pc_wysiwyg" jsonb,
  	"legal_pc_wysiwyg_html" varchar,
  	"legal_terms_title" varchar NOT NULL,
  	"legal_terms_wysiwyg" jsonb,
  	"legal_terms_wysiwyg_html" varchar,
  	"legal_contact_title" varchar NOT NULL,
  	"legal_contact_description" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"description" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload"."payload_admins_sessions" ADD CONSTRAINT "payload_admins_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."payload_admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_indicators_rels" ADD CONSTRAINT "payload_indicators_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_indicators"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_indicators_rels" ADD CONSTRAINT "payload_indicators_rels_payload_versions_fk" FOREIGN KEY ("payload_versions_id") REFERENCES "payload"."payload_versions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_indicator_levels" ADD CONSTRAINT "payload_indicator_levels_indicator_id_payload_indicators_id_fk" FOREIGN KEY ("indicator_id") REFERENCES "payload"."payload_indicators"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_admins_fk" FOREIGN KEY ("payload_admins_id") REFERENCES "payload"."payload_admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_media_fk" FOREIGN KEY ("payload_media_id") REFERENCES "payload"."payload_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_indicators_fk" FOREIGN KEY ("payload_indicators_id") REFERENCES "payload"."payload_indicators"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_indicator_levels_fk" FOREIGN KEY ("payload_indicator_levels_id") REFERENCES "payload"."payload_indicator_levels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_versions_fk" FOREIGN KEY ("payload_versions_id") REFERENCES "payload"."payload_versions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_payload_admins_fk" FOREIGN KEY ("payload_admins_id") REFERENCES "payload"."payload_admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."home_quality_blocs" ADD CONSTRAINT "home_quality_blocs_image_id_payload_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."payload_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."home_quality_blocs" ADD CONSTRAINT "home_quality_blocs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."home_redirections_texts_with_images" ADD CONSTRAINT "home_redirections_texts_with_images_image_id_payload_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."payload_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."home_redirections_texts_with_images" ADD CONSTRAINT "home_redirections_texts_with_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."help_key_indicators_list" ADD CONSTRAINT "help_key_indicators_list_indicator_id_payload_indicators_id_fk" FOREIGN KEY ("indicator_id") REFERENCES "payload"."payload_indicators"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."help_key_indicators_list" ADD CONSTRAINT "help_key_indicators_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."help"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."help_additionnal_indicators_list" ADD CONSTRAINT "help_additionnal_indicators_list_indicator_id_payload_indicators_id_fk" FOREIGN KEY ("indicator_id") REFERENCES "payload"."payload_indicators"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."help_additionnal_indicators_list" ADD CONSTRAINT "help_additionnal_indicators_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."help"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_admins_sessions_order_idx" ON "payload"."payload_admins_sessions" USING btree ("_order");
  CREATE INDEX "payload_admins_sessions_parent_id_idx" ON "payload"."payload_admins_sessions" USING btree ("_parent_id");
  CREATE INDEX "payload_admins_updated_at_idx" ON "payload"."payload_admins" USING btree ("updated_at");
  CREATE INDEX "payload_admins_created_at_idx" ON "payload"."payload_admins" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_admins_email_idx" ON "payload"."payload_admins" USING btree ("email");
  CREATE INDEX "payload_media_updated_at_idx" ON "payload"."payload_media" USING btree ("updated_at");
  CREATE INDEX "payload_media_created_at_idx" ON "payload"."payload_media" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_media_filename_idx" ON "payload"."payload_media" USING btree ("filename");
  CREATE INDEX "payload_indicators_updated_at_idx" ON "payload"."payload_indicators" USING btree ("updated_at");
  CREATE INDEX "payload_indicators_created_at_idx" ON "payload"."payload_indicators" USING btree ("created_at");
  CREATE INDEX "payload_indicators_rels_order_idx" ON "payload"."payload_indicators_rels" USING btree ("order");
  CREATE INDEX "payload_indicators_rels_parent_idx" ON "payload"."payload_indicators_rels" USING btree ("parent_id");
  CREATE INDEX "payload_indicators_rels_path_idx" ON "payload"."payload_indicators_rels" USING btree ("path");
  CREATE INDEX "payload_indicators_rels_payload_versions_id_idx" ON "payload"."payload_indicators_rels" USING btree ("payload_versions_id");
  CREATE INDEX "payload_indicator_levels_indicator_idx" ON "payload"."payload_indicator_levels" USING btree ("indicator_id");
  CREATE INDEX "payload_indicator_levels_updated_at_idx" ON "payload"."payload_indicator_levels" USING btree ("updated_at");
  CREATE INDEX "payload_indicator_levels_created_at_idx" ON "payload"."payload_indicator_levels" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_versions_number_idx" ON "payload"."payload_versions" USING btree ("number");
  CREATE INDEX "payload_versions_updated_at_idx" ON "payload"."payload_versions" USING btree ("updated_at");
  CREATE INDEX "payload_versions_created_at_idx" ON "payload"."payload_versions" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload"."payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload"."payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload"."payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload"."payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload"."payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload"."payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload"."payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_payload_admins_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("payload_admins_id");
  CREATE INDEX "payload_locked_documents_rels_payload_media_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("payload_media_id");
  CREATE INDEX "payload_locked_documents_rels_payload_indicators_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("payload_indicators_id");
  CREATE INDEX "payload_locked_documents_rels_payload_indicator_levels_i_idx" ON "payload"."payload_locked_documents_rels" USING btree ("payload_indicator_levels_id");
  CREATE INDEX "payload_locked_documents_rels_payload_versions_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("payload_versions_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload"."payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload"."payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload"."payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload"."payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload"."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload"."payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_payload_admins_id_idx" ON "payload"."payload_preferences_rels" USING btree ("payload_admins_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload"."payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload"."payload_migrations" USING btree ("created_at");
  CREATE INDEX "home_quality_blocs_order_idx" ON "payload"."home_quality_blocs" USING btree ("_order");
  CREATE INDEX "home_quality_blocs_parent_id_idx" ON "payload"."home_quality_blocs" USING btree ("_parent_id");
  CREATE INDEX "home_quality_blocs_image_idx" ON "payload"."home_quality_blocs" USING btree ("image_id");
  CREATE INDEX "home_redirections_texts_with_images_order_idx" ON "payload"."home_redirections_texts_with_images" USING btree ("_order");
  CREATE INDEX "home_redirections_texts_with_images_parent_id_idx" ON "payload"."home_redirections_texts_with_images" USING btree ("_parent_id");
  CREATE INDEX "home_redirections_texts_with_images_image_idx" ON "payload"."home_redirections_texts_with_images" USING btree ("image_id");
  CREATE INDEX "help_key_indicators_list_order_idx" ON "payload"."help_key_indicators_list" USING btree ("_order");
  CREATE INDEX "help_key_indicators_list_parent_id_idx" ON "payload"."help_key_indicators_list" USING btree ("_parent_id");
  CREATE INDEX "help_key_indicators_list_indicator_idx" ON "payload"."help_key_indicators_list" USING btree ("indicator_id");
  CREATE INDEX "help_additionnal_indicators_list_order_idx" ON "payload"."help_additionnal_indicators_list" USING btree ("_order");
  CREATE INDEX "help_additionnal_indicators_list_parent_id_idx" ON "payload"."help_additionnal_indicators_list" USING btree ("_parent_id");
  CREATE INDEX "help_additionnal_indicators_list_indicator_idx" ON "payload"."help_additionnal_indicators_list" USING btree ("indicator_id");`);
}

export async function down({
	db,
	payload,
	req
}: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   DROP TABLE "payload"."payload_admins_sessions" CASCADE;
  DROP TABLE "payload"."payload_admins" CASCADE;
  DROP TABLE "payload"."payload_media" CASCADE;
  DROP TABLE "payload"."payload_indicators" CASCADE;
  DROP TABLE "payload"."payload_indicators_rels" CASCADE;
  DROP TABLE "payload"."payload_indicator_levels" CASCADE;
  DROP TABLE "payload"."payload_versions" CASCADE;
  DROP TABLE "payload"."payload_kv" CASCADE;
  DROP TABLE "payload"."payload_locked_documents" CASCADE;
  DROP TABLE "payload"."payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload"."payload_preferences" CASCADE;
  DROP TABLE "payload"."payload_preferences_rels" CASCADE;
  DROP TABLE "payload"."payload_migrations" CASCADE;
  DROP TABLE "payload"."home_quality_blocs" CASCADE;
  DROP TABLE "payload"."home_redirections_texts_with_images" CASCADE;
  DROP TABLE "payload"."home" CASCADE;
  DROP TABLE "payload"."help_key_indicators_list" CASCADE;
  DROP TABLE "payload"."help_additionnal_indicators_list" CASCADE;
  DROP TABLE "payload"."help" CASCADE;
  DROP TABLE "payload"."legals" CASCADE;
  DROP TABLE "payload"."footer" CASCADE;
  DROP TYPE "payload"."enum_payload_indicators_slug";
  DROP TYPE "payload"."enum_payload_indicators_icon";
  DROP TYPE "payload"."enum_payload_indicator_levels_color";`);
}
