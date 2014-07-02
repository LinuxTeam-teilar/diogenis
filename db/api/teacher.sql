CREATE OR REPLACE FUNCTION teacher_create(teacherName text, teacherEmail text, teacherPassword text) RETURNS VOID AS $$
DECLARE
BEGIN
    PERFORM email FROM teacher WHERE email = teacherEmail;
    IF FOUND THEN
        RAISE EXCEPTION 'Teacher already exists!';
    END IF;

    INSERT INTO teacher (name, email, password) VALUES (teacherName, teacherEmail, crypt(teacherPassword, gen_salt('md5')));
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION teacher_auth(teacherEmail text, passwordCandidate text) RETURNS VOID AS $$
DECLARE
    teacherPassword text;
BEGIN
    SELECT INTO teacherPassword password FROM teacher WHERE teacherEmail = email;

    IF teacherPassword != crypt(passwordCandidate, teacherPassword) THEN
        RAISE EXCEPTION 'Teacher Authorization has failed!';
    END IF;

END;
$$ LANGUAGE plpgsql;

