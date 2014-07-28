CREATE OR REPLACE FUNCTION lesson_create(teacherId int, departmentId int, lessonName text) RETURNS TEXT AS $$
DECLARE
    lessonRecord record;
BEGIN
    INSERT INTO lesson (name, teacher, department) VALUES (lessonName, teacherId, departmentId)
    RETURNING id, name, teacher, department, recordspresence INTO lessonRecord;

    RETURN row_to_json(lessonRecord);

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION lesson_records_presence(lessonName text, presence boolean) RETURNS TEXT AS $$
DECLARE
    lessonRecord record;
BEGIN
    UPDATE lesson SET recordsPresence = presence WHERE name = lessonName
    RETURNING id, name, teacher, department, recordsPresence INTO lessonRecord;

    RETURN row_to_json(lessonRecord);

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION lesson_list_all() RETURNS JSON AS $$
DECLARE
    jsonArray json[];
    it record;
BEGIN
    FOR it IN SELECT * FROM lesson
    LOOP
        jsonArray := array_append(jsonArray, row_to_json(it));
    END LOOP;
    RETURN array_to_json(jsonArray);

END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION lesson_add_student(lessonId int, studentId int) RETURNS VOID AS $$
DECLARE
BEGIN

    INSERT INTO lessonAttributes (lesson, student) VALUES (lessonId, studentId);

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION validateDepartmentId() RETURNS TRIGGER AS $$
DECLARE
    lessonDepartmentId int;
    studentDepartmentId int;
BEGIN
    SELECT INTO lessonDepartmentId department FROM lesson WHERE NEW.lesson = id;
    SELECT INTO studentDepartmentId department FROM student WHERE NEW.student = id;

    IF lessonDepartmentId != studentDepartmentId THEN
        RAISE EXCEPTION 'You cannot associate a student with a lesson when they don belong in the same department';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_validateDepartmentId ON lessonAttributes;
CREATE TRIGGER trg_validateDepartmentId BEFORE INSERT OR UPDATE ON lessonAttributes
FOR EACH ROW EXECUTE PROCEDURE validateDepartmentId();


CREATE OR REPLACE FUNCTION lesson_remove_student(lessonId int, studentId int) RETURNS VOID AS $$
DECLARE
BEGIN

    DELETE FROM lessonAttributes WHERE lesson = lessonId AND student =  studentId;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Could not delete student from lesson!';
    END IF;

END;
$$ LANGUAGE plpgsql;

