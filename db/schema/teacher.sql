CREATE SEQUENCE seq_teacherIds;

CREATE TABLE teacher
(
    id                 int         primary key default nextval('seq_teacherIds'),
    name               text        not null,
    email              text        not null,
    password           text        not null
);

