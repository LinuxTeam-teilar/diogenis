CREATE OR REPLACE FUNCTION classroom_create(classroomName text) RETURNS JSON AS $$
DECLARE
    classroomJson json;
BEGIN

    PERFORM * FROM classroom WHERE name = classroomName;
    IF FOUND THEN
        SELECT row_to_json(ROW()) INTO classroomJson;
    ELSE
        INSERT INTO classroom (name) VALUES (classroomName)
        RETURNING row_to_json(classroom.*) INTO classroomJson;
    END IF;

    RETURN classroomJson;

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION classroom_change_name(classroomId int, newClassroomName text) RETURNS JSON AS $$
DECLARE
    classroomJson json;
BEGIN

    PERFORM * FROM classroom WHERE id = classroomId;
    IF NOT FOUND THEN
        -- the classroom doesn't exists
        SELECT row_to_json(ROW()) INTO classroomJson;
    ELSE
        UPDATE classroom SET name = newClassroomName
        RETURNING row_to_json(classroom.*) INTO classroomJson;
    END IF;

    RETURN classroomJson;

END;
$$ LANGUAGE plpgsql;

