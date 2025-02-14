PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_places` (
	`userId` integer NOT NULL,
	`name` text,
	`address` text NOT NULL,
	`defaultReceive` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`userId`, `address`)
);
--> statement-breakpoint
INSERT INTO `__new_places`("userId", "name", "address", "defaultReceive") SELECT "userId", "name", "address", "defaultReceive" FROM `places`;--> statement-breakpoint
DROP TABLE `places`;--> statement-breakpoint
ALTER TABLE `__new_places` RENAME TO `places`;--> statement-breakpoint
PRAGMA foreign_keys=ON;