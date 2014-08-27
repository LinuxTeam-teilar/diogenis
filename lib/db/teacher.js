var executeQuery = require('../db.js');
var utils = require('../utils.js');

module.exports.create = function(req, res) {
    var teacherName = req.body.name;
    var teacherPassword = req.body.password;
    var teacherEmail = req.body.email;
    var departmentId = req.session.departmentId;

    var j = {};

    if (!teacherName || !teacherPassword || !teacherEmail) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT teacher_create($1, $2, $3, $4);";
    executeQuery(sqlQuery, [teacherName, teacherEmail, teacherPassword, departmentId], function(err, results) {
        if (err === null && results[0].teacher_create) {
            j = utils.standardJson(req, res);
            j.user = {
                name: teacherName,
                email: teacherEmail
            };
        } else {
            j = utils.errorJson(req, res, 'CreationFailed');
        }

        res.json(j)
    });
};

module.exports.auth = function(req, res) {
    var teacherUsername = req.body.username;
    var teacherPassword = req.body.password;

    var j = {};

    if (!teacherUsername || !teacherPassword) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT success, departmentId, teacherId FROM teacher_auth($1, $2);";
    executeQuery(sqlQuery, [teacherUsername, teacherPassword], function(err, results) {
        if (err === null && results[0].success) {
            req.session.isTeacher = true;
            req.session.departmentId = results[0].departmentid;
            req.session.teacherId = results[0].teacherid;

            j = utils.standardJson(req, res);
            j.user = {
                id: results[0].teacherid,
                username: teacherUsername
            };
        } else {
            j = utils.errorJson(req, res, 'AuthorizationFailed');
        }

        res.json(j)
    });
};

module.exports.listAll = function(req, res) {
    var sqlQuery = "SELECT teacher_list_all();";
    executeQuery(sqlQuery, [], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'DbError');
        } else {
            j = utils.standardJson(req, res);
            j.teachers = {};
            j.teachers = results[0].teacher_list_all
        }

        res.json(j)
    });
};

module.exports.listStudents = function(req, res) {
    var j = {};

    var teacherId = req.session.teacherId;

    var sqlQuery = 'SELECT l.id labId, l.recordsPresence, l.lablimit, l.timeStart, l.timeend, l.day, ' +
                           'c.id classroomId, c.name classroomName, le.id lessonId, le.name lessonName ' +
                   'FROM lab l ' +
                   'INNER JOIN classroom c ON l.classroom = c.id AND l.teacher = $1 ' +
                   'INNER JOIN lesson le ON le.id = l.lesson;';


    executeQuery(sqlQuery, [teacherId], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'DbError');
            res.json(j);
        } else {
            j = utils.standardJson(req, res);
            if (results.length == 0) {
                j.labs = [];
                res.json(j);
            } else {
                j.labs = results;
                var studentsQuery = 'SELECT s.id, s.name, array_agg(sr.record) records, la.isStudentInqueue ' +
                                    'FROM student s ' +
                                    'INNER JOIN studentRecord sr ON sr.lab = $1 AND sr.student = s.id ' +
                                    'INNER JOIN labAttributes la ON la.lab = $1 AND la.student = s.id ' +
                                    'GROUP BY s.id, la.isStudentInqueue;';

                for (i in j.labs) {
                    executeQuery(studentsQuery, [j.labs[i].labid], function(err, studentResults) {
                        if (err !== null) {
                            j = utils.errorJson(req, res, 'DbError');
                            res.json(j);
                        } else {
                            if (studentResults.lenght != 0) {
                                j.labs[i].students = [];
                                j.labs[i].studentsInQueue = [];
                                for (var it in studentResults) {
                                    if (studentResults[it].isstudentinqueue) {
                                        var pos = j.labs[i].studentsinqueue.length;
                                        j.labs[i].studentsinqueue[pos] = it;
                                    } else {
                                        var pos = j.labs[i].students.length;
                                        j.labs[i].students[pos] = studentResults[it];
                                    }
                                }
                            }
                        }

                        if (i == j.labs.length - 1) {
                            res.json(j);
                        }

                    });
                }
            }
        }
    });
};

