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
        [student.name, student.password, student.department, student.username, student.am],
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
        // FIXME
        student.department = 1;
        if (!student.name || !student.am) {
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

module.exports.addRecord = function(req, res) {
    var studentId = req.body.studentId;
    var labId = req.body.labId;

    var j = {};

    if (!studentId || !studentId) {
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

