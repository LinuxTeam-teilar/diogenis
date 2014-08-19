CREATE SEQUENCE seq_classroomIds;

CREATE TABLE classroom
(
    id                 int         primary key default nextval('seq_classroomIds'),
    name               text        unique not null
);

CREATE TABLE classroomSchedule
(
    classroom    int    not null references classroom(id) on delete cascade,
    lab          int    not null references lab(id) on delete cascade,
    timeStart    int    check( timeStart > 0 ),
    timeEnd      int    check( timeEnd > 0 ),
    day          int    check( day > 0 AND day < 6 )
);

