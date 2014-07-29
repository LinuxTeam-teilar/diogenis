CREATE OR REPLACE FUNCTION semester_create(semesterName text) RETURNS JSON AS $$
DECLARE
    semesterRecord record;
BEGIN
    INSERT INTO semester (name) VALUES (semesterName)
    RETURNING id, name INTO semesterRecord;

    RETURN row_to_json(semesterRecord);

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION semester_add_lesson(semesterId int, lessonId int) RETURNS JSON AS $$
DECLARE
    semesterAttributesJson json;
BEGIN
    PERFORM lesson, semester FROM semesterAttributes
    WHERE lesson = lessonId AND semester = semesterId;

    IF NOT FOUND THEN
        INSERT INTO semesterAttributes (semester, lesson) VALUES (semesterId, lessonId);
        SELECT utils_create_json('lesson', 'semester', semesterId, lessonId) INTO semesterAttributesJson;
    ELSE
        SELECT row_to_json(ROW()) INTO semesterAttributesJson;
    END IF;

    RETURN semesterAttributesJson;

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION semester_remove_lesson(semesterId int, lessonId int) RETURNS JSON AS $$
DECLARE
    semesterAttributesJson json;
BEGIN
    PERFORM lesson, semester FROM semesterAttributes
    WHERE lesson = lessonId AND semester = semesterId;

    IF FOUND THEN
        DELETE FROM semesterAttributes WHERE semester = semesterId AND lesson = lessonId;
        SELECT utils_create_json('lesson', 'semester', semesterId, lessonId) INTO semesterAttributesJson;
    ELSE
        SELECT row_to_json(ROW()) INTO semesterAttributesJson;
    END IF;

    RETURN semesterAttributesJson;

END;
$$ LANGUAGE plpgsql;

