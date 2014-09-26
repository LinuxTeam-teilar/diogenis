CREATE SEQUENCE seq_labIds;

CREATE TABLE lab
(
    id              int     primary key default nextval('seq_labIds'),
    lesson          int     not null references lesson(id),
    teacher         int     not null references teacher(id),
    recordsPresence boolean,
    classroom       int     not null references classroom(id),
    labLimit        int     not null,
    timeStart       int     check(timeStart > 0),
    timeEnd         int     check(timeStart > 0),
    day             int     check(day > 0 AND day < 6)
);

CREATE TABLE labAttributes
(
    lab              int      not null references lab(id) on delete cascade,
    student          int      not null references student(id) on delete cascade,
    isStudentInQueue boolean,
    hasLaptop        boolean default false
);

-- student record table has been placed here
-- due to dependency issues
CREATE SEQUENCE seq_studentRecordIds;

CREATE TABLE studentRecord
(
    id      int           primary key default nextval('seq_studentRecordIds'),
    student int           references student(id) on delete cascade,
    lab     int           references lab(id) on delete cascade,
    record  timestamp (0) not null default now()
);

