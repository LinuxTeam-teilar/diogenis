SELECT university_create('TEI Thessaly');
SELECT department_create('T.P.T', 1);

SELECT teacher_create('SuperTeacher', 'superteacher@teilar.gr', '123');
-- this must raise an exception
SELECT teacher_create('SuperTeacher', 'superteacher@teilar.gr', '123');

SELECT teacher_auth('superteacher@teilar.gr', '123');
-- this must raise and exception
SELECT teacher_auth('superteacher@teilar.gr', '1234');
