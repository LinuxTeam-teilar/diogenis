var executeQuery = require('../db.js');
var utils = require('../utils.js');
var studentDionysos = require('../dionysos/student.js');
var fs = require('fs');

function authorizationFailed(req, res) {
    res.json(utils.errorJson(req, res, 'AuthorizationFailed'));
}

function createStudent(req, res, student) {
    var sqlQuery = "SELECT student_create_or_update($1, $2, $3, $4, $5);";
    executeQuery(sqlQuery,
        [student.name, student.password, student.departmentId, student.username, student.am],
    function(err, results) {
        if (err !== null) {
            res.json(utils.errorJson(utils.errorJson(req, res, 'DbError')));
        } else {
            var st = results[0].student_create_or_update;
            req.session.isStudent = true;
            req.session.studentId = st.id;

            var j = utils.standardJson(req, res);
            j.student = st;
            res.json(j);
        }
    });
}

function checkDionysos(req, res, studentUsername, studentPassword) {
    studentDionysos.login(studentUsername, studentPassword, function(student) {
        console.log(student)
        if (!student.name || !student.am ||
            !student.departmentId || !student.departmentId == -1) {
            authorizationFailed(req, res);
            return;
        } else {
            student.username = studentUsername;
            student.password = studentPassword;

            createStudent(req, res, student);
        }
    });
}

module.exports.auth = function(req, res) {
    var studentUsername = req.body.username;
    var studentPassword = req.body.password;

    var j = {};

    if (!studentUsername || !studentPassword) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT student_auth($1, $2);";
    executeQuery(sqlQuery, [studentUsername, studentPassword], function(err, results) {
        if (err !== null) {
            res.json(utils.errorJson(req, res, 'DbError'));
        } else {
            var student = results[0].student_auth;
            if (student.name && student.username && student.department &&
               student.id && student.identity) {
                utils.clearSession(req);
                req.session.isStudent = true;
                req.session.studentId = student.id;
                req.session.departmentId = student.department;

                j = utils.standardJson(req, res);
                j.student = student;
                res.json(j);
            } else {
                checkDionysos(req, res, studentUsername, studentPassword);
            }
        }
    });
};

module.exports.removeLab = function(req, res) {
    var labId = req.body.lab;
    var studentId = req.session.studentId;

    var j = {};

    if (!labId) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT student_remove_lab($1, $2);";
    executeQuery(sqlQuery, [studentId, labId], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'DbError');
        } else {
            var status = results[0].lab_remove;
            if (status) {
                j = utils.standardJson(req, res);
                j.operation = {
                    success: status
                };
            } else {
                j = utils.errorJson(req, res, 'DeletionFailed');
            }
        }
        res.json(j);
    });
};

module.exports.move = function(req, res) {
    var oldLabId = req.body.oldLab;
    var newLabId = req.body.newLab;
    var studentId = req.body.student;

    var j = {};

    if (!oldLabId || !newLabId || !studentId) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT student_move($1, $2, $3);";
    executeQuery(sqlQuery, [oldLabId, newLabId, studentId], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'DbError');
        } else {
            var status = results[0].student_move;
            if (status) {
                j = utils.standardJson(req, res);
                j.operation = {
                    success: status
                };
            } else {
                j = utils.errorJson(req, res, 'MoveFailed');
            }
        }
        res.json(j);
    });
};

module.exports.addRecord = function(req, res) {
    var studentId = req.body.studentId;
    var labId = req.body.labId;

    var j = {};

    if (!studentId || !labId) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT student_add_record($1, $2);";
    executeQuery(sqlQuery, [studentId, labId], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'DbError');
        } else {
            j = utils.standardJson(req, res);
            j.studentRecord = results[0].student_add_record;
            if (!j.studentRecord.student || !j.studentRecord.lab) {
                j = utils.errorJson(req, res, 'CreationFailed');
            }
        }
        res.json(j);
    });
};

module.exports.removeRecord = function(req, res) {
    var studentId = req.body.studentId;
    var labId = req.body.labId;

    var j = {};

    if (!studentId || !labId) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT student_remove_record($1, $2);";
    executeQuery(sqlQuery, [studentId, labId], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'DbError');
        } else {
            j = utils.standardJson(req, res);
            j.studentRecord = results[0].student_remove_record;
            if (!j.studentRecord.student || !j.studentRecord.lab) {
                j = utils.errorJson(req, res, 'DeletionFailed');
            }
        }
        res.json(j);
    });
};

module.exports.listLabs = function(req, res) {
    var studentId = req.session.studentId;
    var j = {};

    var sqlQuery = fs.readFileSync(process.cwd() +
                                   '/db/queries/student_list_labs.sql').toString();

    executeQuery(sqlQuery, [studentId], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'DbError');
        } else {
            j = utils.standardJson(req, res);
            j.student = results[0];
        }
        res.json(j);
    });
};

