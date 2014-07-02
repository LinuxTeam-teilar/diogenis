CREATE SEQUENCE seq_studentIds;

CREATE TABLE student
(
    id                 int         primary key default nextval('seq_studentIds'),
    name               text        not null,
    email              text        unique,
    password           text        not null,
    username           text        unique not null,
    department         int         references department(id) on delete cascade,
    identity           text        unique not null
);

