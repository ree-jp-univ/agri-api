CREATE TABLE `places` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`name` text,
	`address` text NOT NULL,
	`defaultReceive` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE `packing` ADD `status` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `defaultReceive`;