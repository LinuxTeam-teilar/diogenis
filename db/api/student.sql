CREATE OR REPLACE FUNCTION student_create(studentName text, studentPassword text,
                                          departmentId int, studentUsername text, studentIdentity text) RETURNS VOID AS $$
DECLARE
BEGIN
    PERFORM username, identity FROM student WHERE username = studentUsername AND identity = studentIdentity;
    IF FOUND THEN
        RAISE EXCEPTION 'student already exists!';
    END IF;

    INSERT INTO student (name, password, username, identity, department) VALUES
           (studentName, crypt(studentPassword, gen_salt('md5')), studentUsername, studentIdentity, departmentId);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION student_auth(studentUsername text, passwordCandidate text) RETURNS VOID AS $$
DECLARE
    studentPassword text;
BEGIN
    SELECT INTO studentPassword password FROM student WHERE username = studentUsername;

    IF studentPassword != crypt(passwordCandidate, studentPassword) THEN
        RAISE EXCEPTION 'student Authorization has failed!';
    END IF;

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION student_update_email(studentUsername text, studentEmail text) RETURNS VOID AS $$
DECLARE
BEGIN
    UPDATE student SET email = studentEmail WHERE username = studentUsername;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'student does not exist, cannot update email!';
    END IF;

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION student_update_password(studentUsername text, studentPassword text) RETURNS VOID AS $$
DECLARE
BEGIN
    UPDATE student SET password = crypt(studentPassword, gen_salt('md5')) WHERE username = studentUsername;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'student does not exist, cannot update password!';
    END IF;

END;
$$ LANGUAGE plpgsql;

