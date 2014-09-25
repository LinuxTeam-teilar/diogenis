SELECT student_create_or_update('Giorgos Tsiapaliokas', '123', 1, 'giorgosTsiapaliokas', 'T0666');
SELECT student_create_or_update('Antonis Tsiapaliokas', '321', 1, 'AntonisTsiapaliokas', 'T0777');

SELECT student_create_or_update('Nurse Student', '123', 2, 'nursestudent', 'T0888');
SELECT student_create_or_update('Nurse Student 2', '123', 2, 'nursestudent2', 'T0999');
SELECT teacher_create('Nurse Teacher', 'nurseteacher@teilar.gr', '123', 2);
