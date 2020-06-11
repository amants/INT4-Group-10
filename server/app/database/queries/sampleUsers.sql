/*
--Table
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

--Full
INSERT INTO user (username, nickname, password, email, about, joined, avatar, is_mod, is_admin,
                token, salt, public_comments, public_upvotes, public_downvotes, show_mature, theme)
VALUES ("username", "nickname", "password", "email","about", SYSDATE(), "avatar", 0, 0,
                "token", "salt", 1, 1, 1, 1, "theme"
);

--Normal
INSERT INTO user (username, nickname, password, email, is_mod, is_admin)
VALUES ("username", "nickname", "password", "email", 0, 0);

--Minimum
INSERT INTO user (username, password, email)
VALUES ("username", "password", "email");
*/

INSERT INTO user (username, password, email)
VALUES ("jrlol", "123456789", "jrlol@gmail.com");

INSERT INTO user (username, password, email, is_admin)
VALUES ("rexani", "password", "rexani@gmail.com", 1);

INSERT INTO user (username, nickname, password, email, is_mod)
VALUES ("gigagigot", "GigaGigot", "testtest", "gigot@gmail.com", 1);

COMMIT;
