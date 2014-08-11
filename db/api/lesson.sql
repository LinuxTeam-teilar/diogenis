CREATE OR REPLACE FUNCTION lesson_create(teacherId int, departmentId int, lessonName text, _limit int) RETURNS JSON AS $$
DECLARE
    lessonRecord record;
BEGIN
    INSERT INTO lesson (name, teacher, department, lessonLimit) VALUES (lessonName, teacherId, departmentId, _limit)
    RETURNING * INTO lessonRecord;

    RETURN row_to_json(lessonRecord);

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION lesson_records_presence(lessonName text, presence boolean) RETURNS JSON AS $$
DECLARE
    lessonRecord record;
BEGIN
    UPDATE lesson SET recordsPresence = presence WHERE name = lessonName
    RETURNING * INTO lessonRecord;

    RETURN row_to_json(lessonRecord);

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION lesson_list_all(departmentId int) RETURNS JSON AS $$
DECLARE
    jsonArray json[];
    it record;
BEGIN
    FOR it IN SELECT * FROM lesson WHERE department = departmentId
    LOOP
        jsonArray := array_append(jsonArray, row_to_json(it));
    END LOOP;
    RETURN array_to_json(jsonArray);

END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION lesson_add_student(lessonId int, studentId int) RETURNS JSON AS $$
DECLARE
    lessonDepartmentId int;
    studentDepartmentId int;
    lessonLimit int;
    lessonCount int;
    lessonAttributesJson json;
    inQueue boolean;
BEGIN
    SELECT INTO lessonDepartmentId department FROM lesson WHERE lessonId = id;
    SELECT INTO studentDepartmentId department FROM student WHERE studentId = id;

    IF lessonDepartmentId != studentDepartmentId THEN
        RETURN row_to_json(ROW());
    END IF;

    SELECT INTO lessonLimit lesson.lessonLimit FROM lesson WHERE lessonId = id;

    SELECT INTO lessonCount count(student) FROM lessonAttributes
    WHERE lessonId = lesson AND studentId = student;

    IF lessonCount >= lessonLimit THEN
        inQueue := TRUE;
    ELSE
        inQueue := FALSE;
    END IF;

    INSERT INTO lessonAttributes (lesson, student, isStudentInQueue)
    VALUES (lessonId, studentId, inQueue)
    RETURNING row_to_json(lessonAttributes.*) INTO lessonAttributesJson;

    RETURN lessonAttributesJson;

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION lesson_remove_student(lessonId int, studentId int) RETURNS INT AS $$
DECLARE
BEGIN

    DELETE FROM lessonAttributes WHERE lesson = lessonId AND student =  studentId;
    IF NOT FOUND THEN
        RETURN 1;
    END IF;

    RETURN 0;
END;
$$ LANGUAGE plpgsql;

