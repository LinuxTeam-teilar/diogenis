CREATE SEQUENCE seq_semesterIds;

CREATE TABLE semester
(
    id          int         primary key default nextval('seq_semesterIds'),
    name        text        unique not null
);

CREATE TABLE semesterAttributes
(
    semester      int    not null references semester(id) on delete cascade,
    lesson        int    not null references lesson(id) on delete cascade
);

