CREATE TABLE "user_folder_access" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"folder_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_folder_access_user_id_folder_id_unique" UNIQUE("user_id","folder_id")
);
--> statement-breakpoint
ALTER TABLE "user_folder_access" ADD CONSTRAINT "user_folder_access_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_folder_access" ADD CONSTRAINT "user_folder_access_folder_id_folder_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folder"("id") ON DELETE cascade ON UPDATE no action;