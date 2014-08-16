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


-- student record table has been placed here
-- due to dependency issues
CREATE SEQUENCE seq_studentRecordIds;

CREATE TABLE studentRecord
(
    id              int            primary key default nextval('seq_studentRecordIds'),
    student         int            references student(id) on delete cascade,
    lesson          int            references lesson(id) on delete cascade,
    record          timestamp (0)  not null default now()
);

