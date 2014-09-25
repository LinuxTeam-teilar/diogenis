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

    IF startTime >= endTime THEN
        RETURN 8;
    END IF;

    -- so our parameters are valid, lets continue by checking
    -- if the classroom is available

    PERFORM * FROM lab
    WHERE classroom = classroomId
          AND timeStart = startTime
          AND timeEnd = endTime
          AND day = _day;

    IF FOUND THEN
        RETURN 9;
    END IF;

    -- no errors so lets associate the classroom with the lesson
    INSERT INTO lab
    (lesson, teacher, recordsPresence, classroom, lablimit, timeStart, timeEnd, day)
    VALUES
    (lessonId, teacherId, _recordsPresence, classroomId, _limit, startTime, endTime, _day);

    RETURN 0;

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION lab_remove(labId int) RETURNS BOOLEAN AS $$
DECLARE
BEGIN

    PERFORM * FROM labAttributes WHERE lab = labId;
    IF FOUND THEN
        RETURN FALSE;
    END IF;

    DELETE FROM lab WHERE id = labId;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION lab_add_student(labId int, studentId int) RETURNS JSON AS $$
DECLARE
    lessonDepartmentId int;
    studentDepartmentId int;
    labLimit int;
    labCount int;
    labAttributesJson json;
    inQueue boolean;
BEGIN
    SELECT INTO lessonDepartmentId department FROM lesson
    INNER JOIN lab ON lesson.id = lab.lesson AND lab.id = labId;


    -- check if the student has already been added to the lab
    PERFORM * FROM labAttributes
    WHERE lab = labId AND student = studentId;

    IF FOUND THEN
        RETURN row_to_json(ROW());
    END IF;

    -- if the student has already been added to another lab of the same
    -- lesson don't allow him to add himself again
    PERFORM * FROM labAttributes AS la
    INNER JOIN lab AS l
    ON la.lab = l.id AND la.lab = labId AND la.student = studentId
    INNER JOIN lesson AS le
    ON le.id = l.lesson;

    IF FOUND THEN
        RETURN row_to_json(ROW());
    END IF;

    SELECT INTO studentDepartmentId department FROM student WHERE studentId = id;

    IF lessonDepartmentId != studentDepartmentId THEN
        RETURN row_to_json(ROW());
    END IF;

    SELECT INTO labLimit lab.labLimit FROM lab WHERE labId = id;

    SELECT INTO labCount count(student) FROM labAttributes
    WHERE labId = lab;

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

