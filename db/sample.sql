-- Here is a list of the lines that MUST FAIL
-- 11, 15, 22, 23, 27, 31, 32


SELECT university_create('TEI Thessaly');
SELECT department_create('T.P.T', 1);

-------------------------------------- teacher
SELECT teacher_create('SuperTeacher', 'superteacher@teilar.gr', '123');
-- this must raise an exception
SELECT teacher_create('SuperTeacher', 'superteacher@teilar.gr', '123');

SELECT teacher_auth('superteacher@teilar.gr', '123');
-- this must raise and exception
SELECT teacher_auth('superteacher@teilar.gr', '1234');


------------------------------------- student
SELECT student_create('Giorgos Tsiapaliokas', '123', 1, 'giorgosTsiapaliokas', 'T0666');
SELECT student_create('Antonis Tsiapaliokas', '321', 1, 'AntonisTsiapaliokas', 'T0777');
-- those must raise and exception
SELECT student_create('Giorgos Tsiapaliokas', '123', 1, 'giorgosTsiapaliokas', 'T0666');
SELECT student_create('Antonis Tsiapaliokas', '321', 1, 'antonisTsiapaliokas', 'T0666');

SELECT student_auth('giorgosTsiapaliokas', '123');
-- this must raise and exception
SELECT student_auth('giorgosTsiapaliokas', '1234');

SELECT student_update_email('giorgosTsiapaliokas', 'foo@bar.gr');
-- those must raise and exception
SELECT student_update_email('WRONGGGGGGGGGGG', 'foo@bar.gr');
SELECT student_update_email('AntonisTsiapaliokas', 'foo@bar.gr');


