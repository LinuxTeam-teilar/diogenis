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

CREATE OR REPLACE FUNCTION classroom_remove(classroomId int) RETURNS BOOLEAN AS $$
DECLARE
BEGIN

    PERFORM * FROM lab WHERE classroom = classroomId;
    IF FOUND THEN
        RETURN FALSE;
    END IF;

    DELETE FROM classroom WHERE id = classroomId;

    RETURN TRUE;
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

