-- ************************************** `achievement`

CREATE TABLE IF NOT EXISTS `achievement`
(
    `id`          integer NOT NULL ,
    `name`        text NOT NULL ,
    `description` text NOT NULL ,

PRIMARY KEY (`id`),
UNIQUE (`name`(88))
);

-- ************************************** `user`

CREATE TABLE IF NOT EXISTS `user`
(
    `id`                integer NOT NULL AUTO_INCREMENT ,
    `username`          text NOT NULL ,
    `nickname`          text NULL ,
    `password`          text NOT NULL ,
    `email`             text NOT NULL ,
    `about`             text NULL ,
    `joined`            datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `avatar`            text NULL ,
    `is_mod`            boolean NOT NULL DEFAULT 0 ,
    `is_admin`          boolean NOT NULL DEFAULT 0 ,
    `token`             text NULL ,
    `salt`              text NULL ,
    `public_comments`   boolean NOT NULL DEFAULT 1 ,
    `public_upvotes`    boolean NOT NULL DEFAULT 0 ,
    `public_downvotes`  boolean NOT NULL DEFAULT 0 ,
    `show_mature`       boolean NOT NULL DEFAULT 0 ,
    `theme`             text NULL ,

PRIMARY KEY (`id`),
UNIQUE (`username`(24)),
UNIQUE (`nickname`(24)),
UNIQUE (`email`(88))
);

-- ************************************** `user_achievement`

CREATE TABLE IF NOT EXISTS `user_achievement`
(
    `user_fk`           integer NOT NULL ,
    `achievement_fk`    integer NOT NULL ,
    `time`              datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `link`              text NULL ,

PRIMARY KEY (`user_fk`, `achievement_fk`),
CONSTRAINT `user_has_achievement` FOREIGN KEY (`user_fk`) REFERENCES `user` (`id`),
CONSTRAINT `achievement_of_user` FOREIGN KEY (`achievement_fk`) REFERENCES `achievement` (`id`)
);

-- ************************************** `user_stats`

CREATE TABLE IF NOT EXISTS `user_stats`
(
    `user_fk`                   integer NOT NULL ,
    `karma`                     integer NOT NULL DEFAULT 0 ,
    `upvotes`                   integer NOT NULL DEFAULT 0 ,
    `downvotes`                 integer NOT NULL DEFAULT 0 ,
    `posts`                     integer NOT NULL DEFAULT 0 ,
    `comments`                  integer NOT NULL DEFAULT 0 ,
    `posts_on_front`            integer NOT NULL DEFAULT 0 ,
    `original_posts_on_front`   integer NOT NULL DEFAULT 0 ,

PRIMARY KEY (`user_fk`),
CONSTRAINT `user_has_stats` FOREIGN KEY (`user_fk`) REFERENCES `user` (`id`)
);

-- ************************************** `user_ignored`

CREATE TABLE IF NOT EXISTS `user_ignored`
(
    `user_fk`           integer NOT NULL ,
    `ignored_user_fk`   integer NOT NULL ,

PRIMARY KEY (`user_fk`, `ignored_user_fk`),
CONSTRAINT `user_ignores` FOREIGN KEY (`user_fk`) REFERENCES `user` (`id`),
CONSTRAINT `user_ignored` FOREIGN KEY (`ignored_user_fk`) REFERENCES `user` (`id`)
);

-- ************************************** `tag`

CREATE TABLE IF NOT EXISTS `tag`
(
    `id`    integer NOT NULL ,
    `name`  text NOT NULL ,

PRIMARY KEY (`id`)
);

-- ************************************** `tag_ignored`

CREATE TABLE IF NOT EXISTS `tag_ignored`
(
    `user_fk` integer NOT NULL ,
    `tag_fk`  integer NOT NULL ,

PRIMARY KEY (`user_fk`, `tag_fk`),
CONSTRAINT `tag_ignored_by_user` FOREIGN KEY (`tag_fk`) REFERENCES `tag` (`id`),
CONSTRAINT `user_ignores_tag` FOREIGN KEY (`user_fk`) REFERENCES `user` (`id`)
);

-- ************************************** `post`

CREATE TABLE IF NOT EXISTS `post`
(
    `id`                    integer NOT NULL AUTO_INCREMENT ,
    `user_fk`               integer NOT NULL ,
    `title`                 text NOT NULL ,
    `extension`             text NOT NULL ,
    `time_posted`           datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `time_rising`           datetime NULL ,
    `time_front`            datetime NULL ,
    `mature_content`        boolean NOT NULL DEFAULT 0 ,
    `original_content`      boolean NOT NULL DEFAULT 0 ,
    `repost_fk`             integer NULL ,

PRIMARY KEY (`id`),
CONSTRAINT `user_posted` FOREIGN KEY (`user_fk`) REFERENCES `user` (`id`),
CONSTRAINT `post_is_repost` FOREIGN KEY (`repost_fk`) REFERENCES `post` (`id`)
);

-- ************************************** `post_tag`

CREATE TABLE IF NOT EXISTS `post_tag`
(
    `post_fk` integer NOT NULL ,
    `tag_fk`  integer NOT NULL ,

PRIMARY KEY (`post_fk`, `tag_fk`),
CONSTRAINT `tag_of_post` FOREIGN KEY (`tag_fk`) REFERENCES `tag` (`id`),
CONSTRAINT `post_has_tag` FOREIGN KEY (`post_fk`) REFERENCES `post` (`id`)
);

-- ************************************** `user_post_vote`

CREATE TABLE IF NOT EXISTS `post_vote`
(
    `user_fk`       integer NOT NULL ,
    `post_fk`       integer NOT NULL ,
    `upvote`        boolean NOT NULL ,
    `downvote`      boolean NOT NULL ,
    `ip`            text NOT NULL ,
    `time`          datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ,
PRIMARY KEY (`user_fk`, `post_fk`),
CONSTRAINT `user_votes_on_post` FOREIGN KEY (`user_fk`) REFERENCES `user` (`id`),
CONSTRAINT `vote_on_post` FOREIGN KEY (`post_fk`) REFERENCES `post` (`id`)
);

-- ************************************** `user_favorite`

CREATE TABLE IF NOT EXISTS `post_favorite`
(
    `user_fk`   integer NOT NULL ,
    `post_fk`   integer NOT NULL ,
    `time`      datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ,

PRIMARY KEY (`user_fk`, `post_fk`),
CONSTRAINT `user_favorites_post` FOREIGN KEY (`user_fk`) REFERENCES `user` (`id`),
CONSTRAINT `post_favorited` FOREIGN KEY (`post_fk`) REFERENCES `post` (`id`)
);

-- ************************************** `post_report`

CREATE TABLE IF NOT EXISTS `post_report`
(
    `user_fk`   integer NOT NULL ,
    `post_fk`   integer NOT NULL ,
    `time`      datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `reason`    text NOT NULL ,

PRIMARY KEY (`user_fk`, `post_fk`),
CONSTRAINT `user_reports_post` FOREIGN KEY (`user_fk`) REFERENCES `user` (`id`),
CONSTRAINT `report_on_post` FOREIGN KEY (`post_fk`) REFERENCES `post` (`id`)
);

-- ************************************** `post_repost_flag`

CREATE TABLE IF NOT EXISTS `post_repost_flag`
(
    `user_fk`       integer NOT NULL ,
    `post_fk`       integer NOT NULL ,
    `original_fk`   integer NOT NULL ,
    `time`          datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ,

PRIMARY KEY (`user_fk`, `post_fk`),
CONSTRAINT `user_flags_repost` FOREIGN KEY (`user_fk`) REFERENCES `user` (`id`),
CONSTRAINT `post_flagged_as_repost` FOREIGN KEY (`post_fk`) REFERENCES `post` (`id`),
CONSTRAINT `original_post_of_repost_flag` FOREIGN KEY (`original_fk`) REFERENCES `post` (`id`)
);

-- ************************************** `comment`

CREATE TABLE IF NOT EXISTS `comment`
(
    `id`                            integer NOT NULL ,
    `user_fk`                       integer NOT NULL ,
    `post_fk`                       integer NOT NULL ,
    `parent_fk`                     integer NULL ,
    `content`                       text NOT NULL ,
    `has_attachment`                boolean NOT NULL DEFAULT 0 ,
    `attachment_extension`          text NULL ,
    `time_posted`                   datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `edited`                        boolean NOT NULL DEFAULT 0 ,

PRIMARY KEY (`id`),
CONSTRAINT `user_commented` FOREIGN KEY (`user_fk`) REFERENCES `user` (`id`),
CONSTRAINT `comment_on_post` FOREIGN KEY (`post_fk`) REFERENCES `post` (`id`),
CONSTRAINT `replying_comment` FOREIGN KEY (`parent_fk`) REFERENCES `comment` (`id`)
);

-- ************************************** `user_comment_vote`

CREATE TABLE IF NOT EXISTS `comment_vote`
(
    `user_fk`       integer NOT NULL ,
    `comment_fk`    integer NOT NULL ,
    `upvote`        boolean NOT NULL ,
    `downvote`      boolean NOT NULL ,
    `ip`            text NOT NULL ,
    `time`          datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ,

PRIMARY KEY (`user_fk`, `comment_fk`),
CONSTRAINT `user_votes_on_comment` FOREIGN KEY (`user_fk`) REFERENCES `user` (`id`),
CONSTRAINT `vote_on_comment` FOREIGN KEY (`comment_fk`) REFERENCES `comment` (`id`)
);

-- ************************************** `comment_report`

CREATE TABLE IF NOT EXISTS `comment_report`
(
    `user_fk`       integer NOT NULL ,
    `comment_fk`    integer NOT NULL ,
    `time`          datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `reason`        text NOT NULL ,

PRIMARY KEY (`user_fk`, `comment_fk`),
CONSTRAINT `user_reports_comment` FOREIGN KEY (`user_fk`) REFERENCES `user` (`id`),
CONSTRAINT `comment_reported_by_user` FOREIGN KEY (`comment_fk`) REFERENCES `comment` (`id`)
);
