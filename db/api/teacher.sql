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

