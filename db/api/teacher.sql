CREATE OR REPLACE FUNCTION teacher_create(teacherName text, teacherEmail text, teacherPassword text) RETURNS BOOLEAN AS $$
DECLARE
BEGIN
    PERFORM email FROM teacher WHERE email = teacherEmail;
    IF FOUND THEN
        RETURN FALSE;
    END IF;

    INSERT INTO teacher (name, email, password) VALUES
                        (teacherName, teacherEmail, crypt(teacherPassword, gen_salt('md5')));
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION teacher_auth(teacherEmail text, passwordCandidate text) RETURNS BOOLEAN AS $$
DECLARE
    teacherPassword text;
BEGIN
    SELECT INTO teacherPassword password FROM teacher WHERE teacherEmail = email;

    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    IF teacherPassword != crypt(passwordCandidate, teacherPassword) THEN
        RETURN FALSE;
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

