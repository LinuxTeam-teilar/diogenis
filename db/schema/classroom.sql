CREATE SEQUENCE seq_classroomIds;

CREATE TABLE classroom
(
    id                 int         primary key default nextval('seq_classroomIds'),
    name               text        not null
);

CREATE TABLE classroomSchedule
(
    classroom    int    not null references classroom(id) on delete cascade,
    lesson       int    not null references lesson(id) on delete cascade,
    start        int    check( > 0 ),
    end          int    check( > 0 ),
    day          int    check( > 0 AND <6 )
);

