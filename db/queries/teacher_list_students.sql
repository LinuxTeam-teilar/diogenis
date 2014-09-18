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
            CROSS JOIN (
                SELECT student.id, student.name, student.username,
                       student.identity, array_agg(sr.record) AS records,
                       la.isStudentInQueue
                FROM student
                LEFT JOIN studentRecord AS sr ON student.id = sr.student
                INNER JOIN labAttributes AS la ON student.id = la.student
                GROUP BY student.id, la.isStudentInQueue
            ) AS s
            INNER JOIN labAttributes As la ON l.id = la.lab
            INNER JOIN classroom AS c ON c.id = l.classroom
            INNER JOIN lesson AS le ON le.id = l.lesson
            GROUP BY l.id, c.id, le.id
        ) AS _l
    ) AS labs
)
SELECT * FROM result;

