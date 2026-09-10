CREATE TABLE `embroidery_files` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `embroidery_quotes` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`status` text NOT NULL,
	`customer_id` text NOT NULL,
	`search` text NOT NULL,
	`data` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `quotes_owner_status_updated` ON `embroidery_quotes` (`owner`,`status`,`updated_at`);