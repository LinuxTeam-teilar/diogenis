var executeQuery = require('../db.js');
var utils = require('../utils.js');
var fs = require('fs');

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
            utils.clearSession(req);
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

    var sqlQuery = fs.readFileSync(process.cwd() +
                                   '/db/queries/teacher_list_students.sql').toString();

    executeQuery(sqlQuery, [teacherId], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'DbError');
            res.json(j);
        } else {
            j = utils.standardJson(req, res);
            if ( results.lenght === 0) {
                j.teacher = {};
            } else {
                j.teacher = results[0];
            }
            res.json(j);
        }
    });
};

