CREATE OR REPLACE FUNCTION lesson_create(departmentId int, lessonName text) RETURNS JSON AS $$
DECLARE
    lessonRecord record;
BEGIN
    INSERT INTO lesson (name, department) VALUES (lessonName, departmentId)
    RETURNING * INTO lessonRecord;

    RETURN row_to_json(lessonRecord);

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION lesson_add_teacher(lessonId int, teacherId int) RETURNS JSON AS $$
DECLARE
    lessonTeacherRecord record;
BEGIN
    PERFORM * FROM lesson WHERE id = lessonId;
    IF NOT FOUND THEN
        RETURN row_to_json(ROW());
    END IF;

    PERFORM * FROM teacher WHERE id = teacherId;
    IF NOT FOUND THEN
        RETURN row_to_json(ROW());
    END IF;

    INSERT INTO lessonTeachers (lesson, teacher) VALUES (lessonId, teacherId)
    RETURNING * INTO lessonTeacherRecord;

    RETURN row_to_json(lessonTeacherRecord);

END;
$$ LANGUAGE plpgsql;

