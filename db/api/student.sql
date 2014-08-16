CREATE OR REPLACE FUNCTION student_create_or_update(studentName text, studentPassword text,
                                                    departmentId int, studentUsername text,
                                                    studentIdentity text) RETURNS JSON AS $$
DECLARE
    studentRecord record;
BEGIN
    PERFORM * FROM student WHERE username = studentUsername AND identity = studentIdentity
                           AND departmentId = department AND studentName = name;
    IF FOUND THEN
        --just update the password
        UPDATE student SET password = crypt(studentPassword, gen_salt('md5')) WHERE username = studentUsername
        RETURNING INTO studentRecord id, name, username, identity, department, email;
    ELSE
        -- the student doesn't exist, we must create him
        INSERT INTO student (name, password, username, identity, department) VALUES
            (studentName, crypt(studentPassword, gen_salt('md5')), studentUsername, studentIdentity, departmentId)
            RETURNING INTO studentRecord id, name, username, identity, department, email;
    END IF;

    RETURN row_to_json(studentRecord);

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION student_auth(studentUsername text, passwordCandidate text) RETURNS JSON AS $$
DECLARE
    studentPassword text;
    studentRecord record;
BEGIN
    SELECT INTO studentPassword password FROM student WHERE username = studentUsername;

    IF studentPassword != crypt(passwordCandidate, studentPassword) THEN
        SELECT INTO studentRecord ROW();
    ELSE
        SELECT INTO studentRecord id, name, username, department, identity, email
        FROM student WHERE username = studentUsername;
    END IF;

    RETURN row_to_json(studentRecord);

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION student_update_email(studentUsername text, studentEmail text) RETURNS JSON AS $$
DECLARE
    studentRecord record;
BEGIN
    PERFORM * FROM student WHERE username = studentUsername AND email = studentEmail;

    IF NOT FOUND THEN
        SELECT INTO studentRecord ROW();
    ELSE
        UPDATE student SET email = studentEmail WHERE username = studentUsername
        RETURNING INTO studentRecord id, name, username, identity, department, email;
    END IF;

    RETURN row_to_json(studentRecord);

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION student_add_record(studentId int, lessonId int) RETURNS JSON AS $$
DECLARE
    studentRecordJson json;
BEGIN
    PERFORM * FROM student WHERE id = studentId;

    IF NOT FOUND THEN
        RETURN row_to_json(ROW());
    END IF;

    PERFORM * FROM lesson WHERE id = lessonId;

    IF NOT FOUND THEN
        RETURN row_to_json(ROW());
    END IF;

    INSERT INTO studentRecord (student, lesson) VALUES (studentId, lessonId)
    RETURNING row_to_json(studentRecord.*) INTO studentRecordJson;

    RETURN studentRecordJson;

END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION student_remove_record(studentId int, lessonId int) RETURNS JSON AS $$
DECLARE
    studentRecordJson json;
    recordId int;
BEGIN
    PERFORM * FROM student WHERE id = studentId;

    IF NOT FOUND THEN
        RETURN row_to_json(ROW());
    END IF;

    PERFORM * FROM lesson WHERE id = lessonId;

    IF NOT FOUND THEN
        RETURN row_to_json(ROW());
    END IF;

    SELECT INTO recordId id FROM studentRecord
    WHERE student = studentId AND lesson = lessonId
    ORDER BY record DESC
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN row_to_json(ROW());
    END IF;

    DELETE FROM studentRecord WHERE id = recordId
    RETURNING row_to_json(studentRecord.*) INTO studentRecordJson;

    RETURN studentRecordJson;

END;
$$ LANGUAGE plpgsql;

