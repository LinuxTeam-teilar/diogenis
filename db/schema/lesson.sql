CREATE SEQUENCE seq_lessonIds;

CREATE TABLE lesson
(
    id                 int         primary key default nextval('seq_lessonIds'),
    name               text        unique not null,
    teacher            int         not null references teacher(id),
    department         int         not null references department(id),
    recordsPresence    boolean     default false,
    lessonLimit              int
);

CREATE TABLE lessonAttributes
(
    lesson            int      not null references lesson(id) on delete cascade,
    student           int      not null references student(id) on delete cascade,
    isStudentInQueue  boolean
);

