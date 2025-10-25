CREATE TABLE `houses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`price` integer NOT NULL,
	`bedrooms` integer NOT NULL,
	`bathrooms` integer NOT NULL,
	`size` integer NOT NULL,
	`street_name` text NOT NULL,
	`house_number` integer NOT NULL,
	`number_addition` text,
	`zip` text NOT NULL,
	`city` text NOT NULL,
	`construction_year` integer NOT NULL,
	`has_garage` integer NOT NULL,
	`description` text NOT NULL,
	`image` text,
	`made_by_me` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
