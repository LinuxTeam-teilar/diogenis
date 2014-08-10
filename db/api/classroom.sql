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

CREATE OR REPLACE FUNCTION classroom_add_lesson(classroomId int, lessondId int, startTime int,
                                                endTime int, _day int) RETURNS JSON AS $$
DECLARE
   jsonResult json;
BEGIN

    CREATE TEMP TABLE result (
        error int
    ) ON COMMIT DROP;

    INSERT INTO result (error) VALUES (0);

    PERFORM * FROM classroom WHERE id = classroomId;
    IF NOT FOUND THEN
        INSERT INTO result (error) VALUES (1);
        SELECT row_to_json(error.*) INTO jsonResult FROM error;
        RETURN jsonResult;
    END IF;

    PERFORM * FROM lesson WHERE id = lessondId;
    IF NOT FOUND THEN
        INSERT INTO result (error) VALUES (2);
        SELECT row_to_json(error.*) INTO jsonResult FROM error;
        RETURN jsonResult;
    END IF;


    IF startTime NOT BETWEEN 0 AND 23 THEN
        INSERT INTO result (error) VALUES (3);
    END IF;

    IF endTime NOT BETWEEN 0 AND 23 THEN
        INSERT INTO result (error) VALUES (34);
    END IF;

    IF _day NOT BETWEEN 0 AND 5 THEN
        INSERT INTO result (error) VALUES (5);
    END IF;

    PERFORM * FROM result WHERE error > 0;
    IF FOUND THEN
        SELECT row_to_json(error.*) INTO jsonResult FROM error;
        RETURN jsonResult;
    END IF;

    -- so our parameters are valid, lets continue by checking
    -- if the classroom is available

    PERFORM * FROM classroomSchedule
          WHERE classroom = classroomId
          AND timeStart = startTime
          AND timeEnd = endTime
          AND day = _day;

    IF FOUND THEN
        INSERT INTO result (error) VALUES (6);
        SELECT row_to_json(error.*) INTO jsonResult FROM error;
        RETURN jsonResult;
    END IF;

    -- no errors so lets associate the classroom with the lesson
    INSERT INTO classroomSchedule (classroom, lesson, timeStart, timeEnd, day)
    VALUES (classroomId, lessondId, startTime, endTime, _day);

    SELECT row_to_json(ROW()) INTO jsonResult;
    RETURN jsonResult;

END;
$$ LANGUAGE plpgsql;
