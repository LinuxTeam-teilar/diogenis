var executeQuery = require('../db.js');
var utils = require('../utils.js');
var studentDionysos = require('../dionysos/student.js');

function authorizationFailed(req, res) {
    res.json(utils.errorJson(req, res, 'AuthorizationFailed'));
}

function createStudent(req, res, student) {
    var sqlQuery = "SELECT student_create_or_update($1, $2, $3, $4, $5);";
    executeQuery(sqlQuery,
        [student.name, student.password, student.department, student.username, student.am],
    function(err, results) {
        if (err !== null) {
            res.errorJson(utils.error(req, res, 'DbError'));
        } else {
            req.session.isStudent = true;
            var st = results[0].student_create_or_update;
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
    console.log('here')
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

                j = utils.standardJson(req, res);
                j.student = student;
                res.json(j);
            } else {
                checkDionysos(req, res, studentUsername, studentPassword);
            }
        }
    });
};
