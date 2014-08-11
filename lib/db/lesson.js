var executeQuery = require('../db.js');
var utils = require('../utils.js');

module.exports.create = function(req, res) {
    var teacher = req.body.teacher;
    var department = req.body.department;
    var lessonName = req.body.name;
    var limit = req.body.limit;

    var j = {};

    if (!teacher || !department || !lessonName || !limit) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT lesson_create($1, $2, $3, $4);";
    executeQuery(sqlQuery, [teacher, department, lessonName, limit], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'CreationFailed');
        } else {
            j = utils.standardJson(req, res);
            j.lesson = results[0].lesson_create;
            if (j.lesson.name != lessonName || j.lesson.teacher != teacher ||
                j.lesson.department != department || !j.lesson.lessonlimit) {
                j = utils.errorJson(req, res, 'CreationFailed');
            }
        }

        res.json(j);
    });
};

module.exports.recordsPresence = function(req, res) {
    var lessonName = req.body.name;
    var recordsPresence = Boolean(req.body.recordsPresence);

    var j = {};

    if (!lessonName || !recordsPresence) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT lesson_records_presence($1, $2);";
    executeQuery(sqlQuery, [lessonName, recordsPresence], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'CreationFailed');
        } else {
            j = utils.standardJson(req, res);
            j.lesson = results[0].lesson_records_presence;
            if (recordsPresence != j.lesson.recordspresence) {
                j = utils.errorJson(req, res, 'UpdateFailed');
            }
        }

        res.json(j)
    });
};

module.exports.listAll = function(req, res) {
    var departmentId = req.params.departmentId;

    var j = {};

    if (!departmentId) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT lesson_list_all($1);";
    executeQuery(sqlQuery, [departmentId], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'CreationFailed');
        } else {
            j = utils.standardJson(req, res);
            j.lessons = results[0].lesson_list_all
        }

        res.json(j)
    });
};

module.exports.addStudent = function(req, res) {
    var lessonId = req.body.lessonId;
    var studentId = req.body.studentId;

    var j = {};

    if (!lessonId || !studentId) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT lesson_add_student($1, $2);";
    executeQuery(sqlQuery, [lessonId, studentId], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'DbError');
        } else {
            j = utils.standardJson(req, res);
            j.lessonAttributes = results[0].lesson_add_student;
            if (!j.lessonAttributes.student ||
                !j.lessonAttributes.lesson){
                j = utils.errorJson(req, res, 'UpdateFailed');
            }
        }

        res.json(j)
    });
};

module.exports.removeStudent = function(req, res) {
    var lessonId = req.body.lessonId;
    var studentId = req.body.studentId;

    var j = {};

    if (!lessonId || !studentId) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT lesson_remove_student($1, $2);";
    executeQuery(sqlQuery, [lessonId, studentId], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'DbError');
        } else {
            j = utils.standardJson(req, res);
            var result = results[0].lesson_remove_student;
            if (result == 1){
                j = utils.errorJson(req, res, 'DeletionFailed');
            } else if (result == 0) {
                j.operation = {
                   lesson: lessonId,
                   student: studentId,
                   status: true
                };
            } else {
                j = utils.errorJson(req, res, 'DbError');
            }
        }

        res.json(j)
    });
};

