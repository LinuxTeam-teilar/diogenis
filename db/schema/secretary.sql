CREATE SEQUENCE seq_secretaryIds;

CREATE TABLE secretary
(
    id                 int         primary key default nextval('seq_secretaryIds'),
    name               text        unique not null,
    email              text,
    password           text        not null,
    department         int         not null references department(id) on delete cascade
);

