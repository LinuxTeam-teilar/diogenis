var executeQuery = require('../db.js');
var utils = require('../utils.js');

module.exports.create = function(req, res) {
    var teacherName = req.body.username;
    var teacherPassword = req.body.password;
    var teacherEmail = req.body.email;

    var j = {};

    if (!teacherName || !teacherPassword || !teacherEmail) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
    }

    var sqlQuery = "SELECT teacher_create($1, $2, $3);";
    executeQuery(sqlQuery, [teacherName, teacherEmail, teacherPassword], function(err, results) {
        if (err === null && results[0].teacher_create) {
            req.session.teacher = teacherName;
            j = utils.standardJson(req, res);
            j.user = {
                username: teacherName,
                email: teacherEmail
            };
        } else {
            j = utils.errorJson(req, res, 'CreationFailed');
        }

        res.json(j)
    });
};

