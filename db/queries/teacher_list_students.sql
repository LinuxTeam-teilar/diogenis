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

WITH result AS (
    SELECT t.id, t.name, t.email, labs FROM
    (
        SELECT id, name, email FROM teacher WHERE id = $1
    ) AS t,
    (
        SELECT array_to_json(array_agg(_l.*)) AS labs FROM
        (
            SELECT l.*,  c.name AS classroomName, le.name AS lessonName,
                   array_agg(s.*) AS students
            FROM lab AS l
            INNER JOIN labAttributes As la ON l.id = la.lab
            LEFT JOIN (
                SELECT student.id, student.name, student.username, student.identity,
                       array_agg(sr.record) AS records,
                       la.isStudentInQueue, la.hasLaptop, la.lab
                FROM student
                LEFT JOIN studentRecord AS sr ON student.id = sr.student
                INNER JOIN labAttributes AS la ON student.id = la.student
                GROUP BY student.id, la.isStudentInQueue, la.hasLaptop, la.lab
            ) AS s ON s.id = la.student
            INNER JOIN classroom AS c ON c.id = l.classroom
            INNER JOIN lesson AS le ON le.id = l.lesson
            GROUP BY l.id, c.id, le.id
        ) AS _l
    ) AS labs
)
SELECT * FROM result;

