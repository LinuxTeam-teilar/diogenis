CREATE OR REPLACE FUNCTION teacher_remove(teacherId int) RETURNS BOOLEAN AS $$
DECLARE
BEGIN
    PERFORM * FROM teacher WHERE id = teacherId;
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    PERFORM * FROM lab WHERE teacher = teacherId;
    IF FOUND THEN
        RETURN FALSE;
    END IF;

    PERFORM * FROM lessonTeachers WHERE teacher = teacherId;
    IF FOUND THEN
        RETURN FALSE;
    END IF;

    DELETE FROM teacher WHERE id = teacherId;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

