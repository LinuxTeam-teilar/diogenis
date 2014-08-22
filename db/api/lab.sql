CREATE OR REPLACE FUNCTION lab_create(teacherId int, _recordsPresence boolean, lessonId int, _limit int,
                                      classroomId int, startTime int, endTime int, _day int) RETURNS INT AS $$
DECLARE
BEGIN
    PERFORM * FROM classroom WHERE id = classroomId;
    IF NOT FOUND THEN
       RETURN 1;
    END IF;

    PERFORM * FROM lesson WHERE id = lessonId;
    IF NOT FOUND THEN
        RETURN 2;
    END IF;

    IF startTime NOT BETWEEN 0 AND 23 THEN
        RETURN 3;
    END IF;

    IF endTime NOT BETWEEN 0 AND 23 THEN
        RETURN 4;
    END IF;

    IF _day NOT BETWEEN 0 AND 5 THEN
        RETURN 5;
    END IF;

    IF _limit <= 0 THEN
        RETURN 6;
    END IF;

    PERFORM * FROM teacher WHERE id = teacherId;
    IF NOT FOUND THEN
        RETURN 7;
    END IF;

    -- so our parameters are valid, lets continue by checking
    -- if the classroom is available

    PERFORM * FROM lab
    WHERE classroom = classroomId
          AND timeStart = startTime
          AND timeEnd = endTime
          AND day = _day;

    IF FOUND THEN
        RETURN 8;
    END IF;

    -- no errors so lets associate the classroom with the lesson
    INSERT INTO lab
    (lesson, teacher, recordsPresence, classroom, lablimit, timeStart, timeEnd, day)
    VALUES
    (lessonId, teacherId, _recordsPresence, classroomId, _limit, startTime, endTime, _day);

    RETURN 0;

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION lab_add_student(labId int, studentId int) RETURNS JSON AS $$
DECLARE
    labDepartmentId int;
    studentDepartmentId int;
    labLimit int;
    labCount int;
    labAttributesJson json;
    inQueue boolean;
BEGIN
    SELECT INTO labDepartmentId department FROM lab WHERE labId = id;
    SELECT INTO studentDepartmentId department FROM student WHERE studentId = id;

    IF labDepartmentId != studentDepartmentId THEN
        RETURN row_to_json(ROW());
    END IF;

    SELECT INTO labLimit lab.labLimit FROM lab WHERE labId = id;

    SELECT INTO labCount count(student) FROM labAttributes
    WHERE labId = lab AND studentId = student;

    IF labCount >= labLimit THEN
        inQueue := TRUE;
    ELSE
        inQueue := FALSE;
    END IF;

    INSERT INTO labAttributes (lab, student, isStudentInQueue)
    VALUES (labId, studentId, inQueue)
    RETURNING row_to_json(labAttributes.*) INTO labAttributesJson;

    RETURN labAttributesJson;

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION lab_remove_student(labId int, studentId int) RETURNS INT AS $$
DECLARE
BEGIN

    DELETE FROM labAttributes WHERE lab = labId AND student =  studentId;
    IF NOT FOUND THEN
        RETURN 1;
    END IF;

    RETURN 0;
END;
$$ LANGUAGE plpgsql;

