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

CREATE OR REPLACE FUNCTION lesson_create(departmentId int, lessonName text) RETURNS JSON AS $$
DECLARE
    lessonRecord record;
BEGIN
    INSERT INTO lesson (name, department) VALUES (lessonName, departmentId)
    RETURNING * INTO lessonRecord;

    RETURN row_to_json(lessonRecord);

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION lesson_remove(lessonId int) RETURNS BOOLEAN AS $$
DECLARE
BEGIN

    PERFORM * FROM lab WHERE lesson = lessonId;
    IF FOUND THEN
        RETURN FALSE;
    END IF;

    DELETE FROM lesson WHERE id = lessonId;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION lesson_add_teacher(lessonId int, teacherId int) RETURNS JSON AS $$
DECLARE
    lessonTeacherRecord record;
BEGIN
    PERFORM * FROM lesson WHERE id = lessonId;
    IF NOT FOUND THEN
        RETURN row_to_json(ROW());
    END IF;

    PERFORM * FROM teacher WHERE id = teacherId;
    IF NOT FOUND THEN
        RETURN row_to_json(ROW());
    END IF;

    INSERT INTO lessonTeachers (lesson, teacher) VALUES (lessonId, teacherId)
    RETURNING * INTO lessonTeacherRecord;

    RETURN row_to_json(lessonTeacherRecord);

END;
$$ LANGUAGE plpgsql;

