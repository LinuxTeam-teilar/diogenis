--Copyright 2014 Antonis Tsiapaliokas <antonis.tsiapaliokas@kde.org>
--Copyright 2014 Giorgos Tsiapaliokas <giorgos.tsiapaliokas@kde.org>

--This program is free software; you can redistribute it and/or
--modify it under the terms of the GNU General Public License as
--published by the Free Software Foundation; either version 2 of
--the License, or (at your option) any later version.

--This program is distributed in the hope that it will be useful,
--but WITHOUT ANY WARRANTY; without even the implied warranty of
--MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
--GNU General Public License for more details.

--You should have received a copy of the GNU General Public License
--along with this program.  If not, see <http://www.gnu.org/licenses/>.

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

CREATE OR REPLACE FUNCTION student_remove_lab(studentId int, labId int) RETURNS BOOLEAN AS $$
DECLARE
BEGIN

    PERFORM * FROM labAttributes
    WHERE student = studentId AND lab = labId AND isStudentInQueue = TRUE;
    IF FOUND THEN
        RETURN FALSE;
    END IF;

    DELETE FROM labAttributes WHERE lab= labId AND student = studentId;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION student_move(oldLabId int, newLabId int, studentId int) RETURNS BOOLEAN AS $$
DECLARE
BEGIN

    PERFORM * FROM labAttributes
    WHERE student = studentId AND lab = oldLabId;
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    DELETE FROM labAttributes WHERE lab = oldLabId AND student = studentId;

    PERFORM lab_add_student(newLabId, studentId);

    RETURN TRUE;
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

CREATE OR REPLACE FUNCTION student_add_record(studentId int, labId int) RETURNS JSON AS $$
DECLARE
    studentRecordJson json;
BEGIN
    PERFORM * FROM student WHERE id = studentId;

    IF NOT FOUND THEN
        RETURN row_to_json(ROW());
    END IF;

    PERFORM * FROM lab WHERE id = labId;

    IF NOT FOUND THEN
        RETURN row_to_json(ROW());
    END IF;

    INSERT INTO studentRecord (student, lab) VALUES (studentId, labId)
    RETURNING row_to_json(studentRecord.*) INTO studentRecordJson;

    RETURN studentRecordJson;

END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION student_remove_record(studentId int, labId int) RETURNS JSON AS $$
DECLARE
    studentRecordJson json;
    recordId int;
BEGIN
    PERFORM * FROM student WHERE id = studentId;

    IF NOT FOUND THEN
        RETURN row_to_json(ROW());
    END IF;

    PERFORM * FROM lab WHERE id = labId;

    IF NOT FOUND THEN
        RETURN row_to_json(ROW());
    END IF;

    SELECT INTO recordId id FROM studentRecord
    WHERE student = studentId AND lab = labId
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

