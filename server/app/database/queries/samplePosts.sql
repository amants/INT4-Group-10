/*
--Table
    `id`                    integer NOT NULL AUTO_INCREMENT ,
    `user_fk`               integer NOT NULL ,
    `title`                 text NOT NULL ,
    `extension`             text NOT NULL ,
    `time_posted`           datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `time_rising`           datetime NULL ,
    `time_front`            datetime NULL ,
    `mature_content`        boolean NOT NULL ,
    `original_content`      boolean NOT NULL ,
    `repost_fk`             integer NULL ,

--Full
INSERT INTO post (user_fk, title, extension, time_posted, time_rising, time_front, mature_content, original_content, repost_fk)
VALUES (1, "title", "extension", SYSDATE(), SYSDATE(), SYSDATE(), 1, 1, 1);

--Normal
INSERT INTO post (user_fk, title, extension, time_posted, mature_content, original_content)
VALUES (1, "title", "extension", SYSDATE(), 1, 1);

--Minimum
INSERT INTO post (user_fk, title, extension)
VALUES (1, "title", "extension");
*/

INSERT INTO post (user_fk, title, extension)
VALUES (1, "Omae wa mou shindeiru", "webm");

INSERT INTO post (user_fk, title, extension)
VALUES (1, "Renai Circulation", "png");

INSERT INTO post (user_fk, title, extension)
VALUES (2, "YEET", "mp4");

INSERT INTO post (user_fk, title, extension, mature_content)
VALUES (2, "N-Word", "jpg", 1);

INSERT INTO post (user_fk, title, extension, original_content)
VALUES (3, ":StaresRexani:", "jpg", 1);

COMMIT;
