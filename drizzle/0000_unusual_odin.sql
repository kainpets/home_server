CREATE TABLE `photos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text,
	`title` text,
	`filename` text NOT NULL,
	`filePath` text NOT NULL,
	`fileSize` integer NOT NULL,
	`mimeType` text NOT NULL,
	`width` integer,
	`height` integer,
	`description` text,
	`owner_id` integer,
	`uploaded_at` text,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `slug_idx` ON `photos` (`slug`);--> statement-breakpoint
CREATE INDEX `owner_id_idx` ON `photos` (`owner_id`);--> statement-breakpoint
CREATE INDEX `uploaded_at_idx` ON `photos` (`uploaded_at`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`first_name` text,
	`last_name` text,
	`email` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `email_idx` ON `users` (`email`);