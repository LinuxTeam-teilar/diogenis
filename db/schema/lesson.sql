CREATE SEQUENCE seq_lessonIds;

CREATE TABLE lesson
(
    id                 int         primary key default nextval('seq_lessonIds'),
    name               text        unique not null,
    department         int         not null references department(id)
);

CREATE TABLE lessonTeachers
(
    lesson            int      not null references lesson(id) on delete cascade,
    teacher           int      not null references teacher(id) on delete cascade
);

