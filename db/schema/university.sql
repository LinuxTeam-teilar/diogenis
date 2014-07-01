CREATE SEQUENCE seq_universityIds;

CREATE TABLE university
(
    id          int         primary key default nextval('seq_universityIds'),
    name        text        not null
);

