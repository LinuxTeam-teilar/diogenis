var executeQuery = require('../db.js');
var utils = require('../utils.js');

module.exports.create = function(req, res) {
    var semesterName = req.body.name;

    var j = {};

    if (!semesterName) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT semester_create($1);";
    executeQuery(sqlQuery, [semesterName], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'CreationFailed');
        } else {
            j = utils.standardJson(req, res);
            j.semester = results[0].semester_create;
            if (j.semester.name != semesterName ) {
                j = utils.errorJson(req, res, 'CreationFailed');
            }
        }

        res.json(j);
    });
};

module.exports.addLesson = function(req, res) {
    var semesterId = req.body.semester;
    var lessonId = req.body.lesson;

    var j = {};

    if (!semesterId || !lessonId) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT semester_add_lesson($1, $2);";
    executeQuery(sqlQuery, [semesterId, lessonId], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'CreationFailed');
        } else {
            j = utils.standardJson(req, res);
            j.semesterAttributes = results[0].semester_add_lesson;

            if (!j.semesterAttributes.semester || !j.semesterAttributes.lesson ) {
                j = utils.errorJson(req, res, 'AlreadyExists');
            }
        }

        res.json(j);
    });
};

module.exports.removeLesson = function(req, res) {
    var semesterId = req.body.semester;
    var lessonId = req.body.lesson;

    var j = {};

    if (!semesterId || !lessonId) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT semester_remove_lesson($1, $2);";
    executeQuery(sqlQuery, [semesterId, lessonId], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'DeletionFailed');
        } else {
            j = utils.standardJson(req, res);
            j.semesterAttributes = results[0].semester_remove_lesson;

            if (!j.semesterAttributes.semester || !j.semesterAttributes.lesson ) {
                j = utils.errorJson(req, res, 'NotExist');
            }
        }

        res.json(j);
    });
};
