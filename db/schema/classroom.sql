CREATE SEQUENCE seq_classroomIds;

CREATE TABLE classroom
(
    id                 int         primary key default nextval('seq_classroomIds'),
    name               text        unique not null
);

