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

    IF isDepartmentLocked(lessonDepartmentId) THEN
        RETURN row_to_json(ROW());
    END IF;

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
