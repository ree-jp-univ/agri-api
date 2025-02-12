CREATE TABLE `farmer` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`address` text NOT NULL,
	`content` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`amount` integer NOT NULL,
	`receivePlace` text NOT NULL,
	`defaultReceive` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `packing` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`orderId` integer NOT NULL,
	`farmerId` integer NOT NULL,
	`content` text NOT NULL,
	`num` integer,
	`receiveDate` text DEFAULT '未確定' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text DEFAULT 'ユーザー名' NOT NULL
);
