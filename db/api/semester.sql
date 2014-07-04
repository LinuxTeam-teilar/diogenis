CREATE OR REPLACE FUNCTION semester_create(semesterName text) RETURNS VOID AS $$
DECLARE
BEGIN
    INSERT INTO semester (name) VALUES (semesterName);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION semester_add_lesson(semesterId int, lessonId int) RETURNS VOID AS $$
DECLARE
BEGIN

    INSERT INTO semesterAttributes (semester, lesson) VALUES (semesterId, lessonId);

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION semester_remove_lesson(semesterId int, lessonId int) RETURNS VOID AS $$
DECLARE
BEGIN

    DELETE FROM semesterAttributes WHERE semester = semesterId AND lesson = lessonId;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Could not delete lesson from semester';
    END IF;

END;
$$ LANGUAGE plpgsql;

