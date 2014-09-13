WITH result AS (
    SELECT s.name, s.email, s.department, s.username, s.identity, s.id, labs, labsInQueue FROM
    (
        SELECT * FROM student WHERE id = $1
    ) AS s,
    (
        SELECT array_to_json(array_agg(_l.*)) AS labs FROM
        (
            SELECT l.*, array_agg(sr.record) AS records, c.id AS classroomId, c.name AS classroomName,
                   le.id AS lessonId, le.name AS lessonName
            FROM lab AS l
            INNER JOIN labAttributes As la ON l.id = la.lab
            INNER JOIN student AS s ON s.id = la.student AND s.id = $1 AND la.isStudentInQueue = false
            LEFT JOIN studentRecord as sr ON sr.lab = l.id AND sr.student = $1
            INNER JOIN classroom AS c ON c.id = l.classroom
            INNER JOIN lesson AS le ON le.id = l.lesson
            GROUP BY l.id, c.id, le.id
        ) AS _l
    ) AS labs,
    (
        SELECT array_agg(_l2.*) AS labsInQueue FROM
        (
            SELECT l2.*, array_agg(sr2.record) AS records, c2.id AS classroomId, c2.name AS classroomName,
                   le2.id AS lessonId, le2.name AS lessonName
            FROM lab AS l2
            INNER JOIN labAttributes As la2 ON l2.id = la2.lab
            INNER JOIN student AS s2 ON s2.id = la2.student AND s2.id = $1 AND la2.isStudentInQueue = true
            LEFT JOIN studentRecord as sr2 ON sr2.lab = l2.id AND sr2.student = $1
            INNER JOIN classroom AS c2 ON c2.id = l2.classroom
            INNER JOIN lesson AS le2 ON le2.id = l2.lesson
            GROUP BY l2.id, c2.id, le2.id
        ) AS _l2
    ) as labsInQueue
)
SELECT * FROM result;

