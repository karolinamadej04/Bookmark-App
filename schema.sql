CREATE DATABASE bookmark_db;
USE bookmark_db;

CREATE TABLE users (
    user_id integer PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    creation_date DATE NOT NULL DEFAULT CURDATE()
);

CREATE TABLE folders(
    folder_id integer PRIMARY KEY AUTO_INCREMENT,
    creator_id integer NOT NULL,
    name VARCHAR(255),
    visibility integer NOT NULL DEFAULT 0, -- 0: private, 1: restricted, 2: public
    member_privileges boolean NOT NULL DEFAULT 0,
    creation_date DATE NOT NULL DEFAULT CURDATE(),
    CONSTRAINT fk_Creator
    FOREIGN KEY (creator_id)
    REFERENCES users(user_id)
);

CREATE TABLE bookmarks(
    bookmark_id integer PRIMARY KEY AUTO_INCREMENT,
    folder_id integer NOT NULL,
    name VARCHAR(255) NOT NULL,
    link VARCHAR(255) NOT NULL,
    scheduler integer,
    change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    page_status char NOT NULL DEFAULT '1',
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_Folder
    FOREIGN KEY (folder_id)
    REFERENCES folders(folder_id)
    ON DELETE CASCADE
);

CREATE TABLE members(
    member_id integer PRIMARY KEY AUTO_INCREMENT,
    folder_id integer NOT NULL,
    user_id integer NOT NULL,
    role integer NOT NULL DEFAULT 0,
    filter_type integer NOT NULL DEFAULT 0,
    CONSTRAINT fk_member_folder
    FOREIGN KEY (folder_id)
    REFERENCES folders(folder_id),
    CONSTRAINT fk_member_user
    FOREIGN KEY (user_id)
    REFERENCES users(user_id)
);

CREATE TABLE domains(
    domain_id integer PRIMARY KEY AUTO_INCREMENT,
    folder_id integer NOT NULL,
    domain VARCHAR(255) NOT NULL,
    CONSTRAINT fk_domain_folder
    FOREIGN KEY (folder_id)
    REFERENCES folders(folder_id)
);
CREATE TABLE filters(
    filter_id integer PRIMARY KEY AUTO_INCREMENT,
    folder_id integer NOT NULL,
    filtered_phrase VARCHAR(255) NOT NULL,
    CONSTRAINT fk_filter_folder
    FOREIGN KEY (folder_id)
    REFERENCES folders(folder_id)
);

CREATE TABLE clickNumbers(
    click_number_id integer PRIMARY KEY AUTO_INCREMENT,
    member_id integer NOT NULL,
    bookmark_id integer NOT NULL,
    number integer NOT NULL DEFAULT 0,
    last_click_date DATE,
    CONSTRAINT fk_click_member
    FOREIGN KEY (member_id)
    REFERENCES members(member_id),
    CONSTRAINT fk_click_bookmark
    FOREIGN KEY (bookmark_id)
    REFERENCES bookmarks(bookmark_id)
);

CREATE TABLE managers (
    manager_id integer PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    manager_password VARCHAR(255) NOT NULL,
    creation_date DATE NOT NULL DEFAULT CURDATE()
);

CREATE TABLE reports (
    report_id integer PRIMARY KEY AUTO_INCREMENT,
    user_id integer NOT NULL,
    bookmark_id integer NOT NULL,
    reason VARCHAR(255),
    creation_date DATE NOT NULL DEFAULT CURDATE(),
    CONSTRAINT fk_report_user
    FOREIGN KEY (user_id)
    REFERENCES users(user_id),
    CONSTRAINT fk_report_bookmark
    FOREIGN KEY (bookmark_id)
    REFERENCES bookmarks(bookmark_id)
);

INSERT INTO users (email, user_password)
VALUES
('km12@gmail.com', '$2b$10$JsNrph5X4Ao8sVmJBvdnV.3e/GnAhPv5fv3ih1L48Fk5.xYosfGje'), -- hasło: abc
('bm13@gmail.com', '$2b$10$7PS.hNogWYhq6cwv1kJtJ.STh5notONf5/dYw7TBAkUQwLg4X0z1u'), -- hasło: 123
('cm12@gmail.com', '$2b$10$YKup7KxRb..Qq3VKXpT/I.7q/UPCNHZmVV6pdU9.sJdgtEHBg/gNS'); -- hasło: 456

INSERT INTO folders (creator_id, name, visibility, member_privileges)
VALUES
(1, 'Mój folder', 0, 0),
(2, 'Mój folder 2', 1, 1),
(3, 'Mój folder 2', 1, 1);

INSERT INTO bookmarks (folder_id, name, link)
VALUES 
(1, 'youtube', 'https://www.youtube.com/'),
(1, 'inaturalist', 'https://www.inaturalist.org/places/poland');
(2, 'inaturalist', 'https://www.inaturalist.org/places/poland');

INSERT INTO members (folder_id, user_id)
VALUES
(1, 2),
(2, 3),
(3, 1);

INSERT INTO domains (folder_id, domain)
VALUES
(1, 'https://www.youtube.com/'),
(2, 'https://www.inaturalist.org/');

INSERT INTO filters (folder_id, filtered_phrase)
VALUES
(1, 'filtered phrase 1'), 
(1, 'filtered phrase 2'), 
(2, 'filtered phrase 1'), 
(2, 'filtered phrase 2');

INSERT INTO clickNumbers (member_id, bookmark_id)
VALUES
(1, 1),
(2, 2);

INSERT INTO managers (email, manager_password)
VALUES
('admin@gmail.com', 'admin'),
('admin2@gmail.com', 'admin2');

INSERT INTO reports (user_id, bookmark_id, reason)
VALUES
(2, 1, 'Powód'),
(3, 2, 'Powód 2');