CREATE OR REPLACE FUNCTION teacher_create(teacherName text, teacherEmail text, teacherPassword text, departmentId int) RETURNS BOOLEAN AS $$
DECLARE
BEGIN
    PERFORM email FROM teacher WHERE email = teacherEmail;
    IF FOUND THEN
        RETURN FALSE;
    END IF;

    INSERT INTO teacher (name, email, password, department) VALUES
                        (teacherName, teacherEmail, crypt(teacherPassword, gen_salt('md5')), departmentId);
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION teacher_auth(teacherEmail text, passwordCandidate text, OUT success boolean,
                                                                                   OUT departmentId int,
                                                                                   OUT teacherId int) AS $$
DECLARE
    teacherRecord record;
    department int;
BEGIN
    success := TRUE;

    SELECT INTO teacherRecord * FROM teacher WHERE teacherEmail = email;

    IF NOT FOUND THEN
        success := FALSE;
        RETURN;
    END IF;

    IF teacherRecord.password != crypt(passwordCandidate, teacherRecord.password) THEN
        success := FALSE;
        RETURN;
    END IF;

    departmentId := teacherRecord.department;
    teacherId := teacherRecord.id;

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION teacher_list_all(departmentId int) RETURNS JSON AS $$
DECLARE
    jsonArray json[];
    it record;
BEGIN
    FOR it IN SELECT id, name, email FROM teacher WHERE department = departmentId
    LOOP
        jsonArray := array_append(jsonArray, row_to_json(it));
    END LOOP;
    RETURN array_to_json(jsonArray);
END;
$$ LANGUAGE plpgsql;

