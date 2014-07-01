CREATE SEQUENCE seq_universityIds;

CREATE TABLE univerity
(
    id          int         primary key default nextval('seq_universityIds'),
    name        text        not null
);

