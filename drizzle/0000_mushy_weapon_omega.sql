CREATE TABLE `users` (
	`uid` varchar(36) NOT NULL DEFAULT (UUID()),
	`username` varchar(32) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`role` enum('ADMIN','USER','MODERATOR') NOT NULL DEFAULT 'USER',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_uid` PRIMARY KEY(`uid`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
