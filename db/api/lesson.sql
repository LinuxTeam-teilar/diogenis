CREATE OR REPLACE FUNCTION lesson_create(teacherId int, departmentId int, lessonName text) RETURNS VOID AS $$
DECLARE
BEGIN
    INSERT INTO lesson (name, teacher, department) VALUES (lessonName, teacherId, departmentId);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION lesson_records_presence(lessonName text, presence boolean) RETURNS VOID AS $$
DECLARE
BEGIN
    UPDATE lesson SET recordsPresence = presence WHERE name = lessonName;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'The lesson does not exist';
    END IF;

END;
$$ LANGUAGE plpgsql;

