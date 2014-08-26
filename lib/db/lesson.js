var executeQuery = require('../db.js');
var utils = require('../utils.js');

module.exports.create = function(req, res) {
    var department = req.body.department;
    var lessonName = req.body.name;

    var j = {};

    if (!department || !lessonName) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT lesson_create($1, $2);";
    executeQuery(sqlQuery, [department, lessonName], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'CreationFailed');
        } else {
            j = utils.standardJson(req, res);
            j.lesson = results[0].lesson_create;
            if (j.lesson == {}) {
                j = utils.errorJson(req, res, 'CreationFailed');
            }
        }

        res.json(j);
    });
};

module.exports.addTeacher = function(req, res) {
    var lessonId = req.body.lesson
    var teacherId = req.body.teacher;

    var j = {};

    if (!lessonId || !teacherId) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT lesson_add_teacher($1, $2);";
    executeQuery(sqlQuery, [lessonId, teacherId], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'CreationFailed');
        } else {
            j = utils.standardJson(req, res);
            j.lesson = results[0].lesson_add_teacher;
            if (j.lesson == {}) {
                j = utils.errorJson(req, res, 'CreationFailed');
            }
        }

        res.json(j);
    });
};

module.exports.listAll = function(req, res) {
    var j = {};

    var sqlQuery = "SELECT lesson.name AS name, lesson.id AS id, array_to_json(array_agg(t.*)) AS teachers " +
                   "FROM lesson " +
                   "INNER JOIN lessonTeachers lt " +
                   "ON lesson.department = $1 AND lt.lesson = lesson.id " +
                   "INNER JOIN teacher t " +
                   "ON lt.teacher = t.id " +
                   "GROUP BY lesson.id;"

    executeQuery(sqlQuery, [req.session.departmentId], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'DbError');
        } else {
            j = utils.standardJson(req, res);
            if (results.length === 0) {
                j.lessons = [];
            } else {
                for (var i in results) {
                    for (var it in results[i].teachers) {
                        delete results[i].teachers[it].password
                    }
                }
                j.lessons = results;
            }
        }
        res.json(j)
    });
};


