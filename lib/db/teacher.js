var executeQuery = require('../db.js');
var utils = require('../utils.js');

module.exports.create = function(req, res) {
    var teacherName = req.body.name;
    var teacherPassword = req.body.password;
    var teacherEmail = req.body.email;

    var j = {};

    if (!teacherName || !teacherPassword || !teacherEmail) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT teacher_create($1, $2, $3);";
    executeQuery(sqlQuery, [teacherName, teacherEmail, teacherPassword], function(err, results) {
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

    var sqlQuery = "SELECT teacher_auth($1, $2);";
    executeQuery(sqlQuery, [teacherUsername, teacherPassword], function(err, results) {
        if (err === null && results[0].teacher_auth) {
            req.session.isTeacher = true;

            j = utils.standardJson(req, res);
            j.user = {
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
            console.log(results[0])
            j.teachers = {};
            j.teachers = results[0].teacher_list_all
        }

        res.json(j)
    });
};

