/*
Copyright 2014 Antonis Tsiapaliokas <antonis.tsiapaliokas@kde.org>
Copyright 2014 Giorgos Tsiapaliokas <giorgos.tsiapaliokas@kde.org>

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 2 of
the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var executeQuery = require('../db.js');
var utils = require('../utils.js');

module.exports.create = function(req, res) {
    var lesson = req.body.lesson;
    var teacher = req.body.teacher;
    var recordsPresence = req.body.recordspresence === 'true';
    var limit = req.body.limit;
    var classroom = req.body.classroom;
    var startTime = req.body.starttime;
    var endTime = req.body.endtime;
    var day = req.body.day;

    var j = {};

    if (!lesson || !teacher || recordsPresence == 'undefined' || !limit ||
        !classroom || !startTime || !endTime || !day) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT lab_create($1, $2, $3, $4, $5, $6, $7, $8);";
    var args = [
                teacher, recordsPresence, lesson, limit,
                classroom, startTime, endTime, day
    ];

    executeQuery(sqlQuery, args, function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'CreationFailed');
        } else {
            j = utils.standardJson(req, res);
            var resultCode = results[0].lab_create;

            if (resultCode >= 1 && resultCode <= 8) {
                j = utils.errorJson(req, res, 'NotExist');
            } else if (resultCode == 9) {
                j = utils.errorJson(req, res, 'ClassroomAlreadyUsed');
            } else if (resultCode == 0) {
                j.lab = {
                    "classroom": parseInt(classroom),
                    "lesson": parseInt(lesson),
                    "teacher": parseInt(teacher),
                    "limit": parseInt(limit),
                    "recordspresence": recordsPresence,
                    "startTime": parseInt(startTime),
                    "endTime": parseInt(endTime),
                    "day": parseInt(day)
                };
            }
        }

        res.json(j);
    });
};

module.exports.remove = function(req, res) {
    var labId = req.body.lab;

    var j = {};

    if (!labId) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT lab_remove($1);";
    executeQuery(sqlQuery, [labId], function(err, results) {
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

module.exports.list = function(req, res) {
    var j = {};

    var sqlQuery = "SELECT l.id AS labId, le.id AS lessonId, le.name AS lessonName, " +
                   "t.id AS teacherId, t.name AS teacherName, t.email AS teacherEmail, " +
                   "l.recordsPresence, c.id AS classroomId, c.name AS classroomName, " +
                   "l.labLimit, l.timeStart, l.timeEnd, l.day " +
                   "FROM lab AS l " +
                   "INNER JOIN lesson AS le on l.lesson = le.id AND le.department = $1" +
                   "INNER JOIN teacher AS t ON l.teacher = t.id " +
                   "INNER JOIN classroom AS c ON c.id = l.classroom;";

    executeQuery(sqlQuery, [req.session.departmentId], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'DbError');
        } else {
            j = utils.standardJson(req, res);
            j.labs = results
        }

        res.json(j)
    });
};

module.exports.addStudent = function(req, res) {
    var labId = req.body.labId;
    var studentId = req.body.studentId;

    var j = {};

    if (!labId || !studentId) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT lab_add_student($1, $2);";
    executeQuery(sqlQuery, [labId, studentId], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'DbError');
        } else {
            j = utils.standardJson(req, res);
            j.labAttributes = results[0].lab_add_student;
            if (!j.labAttributes.student ||
                !j.labAttributes.lab) {
                j = utils.errorJson(req, res, 'UpdateFailed');
            }
        }

        res.json(j)
    });
};

function modifyLaptop(req, res, hasLaptop) {
    var labId = req.body.labId;
    var studentId = req.body.studentId;

    var j = {};

    if (!labId || !studentId) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT lab_modify_laptop($1, $2, $3);";
    executeQuery(sqlQuery, [labId, studentId, hasLaptop], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'DbError');
        } else {
            j = utils.standardJson(req, res);
            var status = results[0].lab_modify_laptop;
            if (!status) {
                j = utils.errorJson(req, res, 'UpdateFailed');
            } else {
                j.operation = {
                    success: true
                };
            }
        }

        res.json(j)
    });
};

module.exports.addLaptop = function(req, res) {
    modifyLaptop(req, res, true);
};

module.exports.removeLaptop = function(req, res) {
    modifyLaptop(req, res, false);
};

module.exports.removeStudent = function(req, res) {
    var labId = req.body.labId;
    var studentId = req.body.studentId;

    var j = {};

    if (!labId || !studentId) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT lab_remove_student($1, $2);";
    executeQuery(sqlQuery, [labId, studentId], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'DbError');
        } else {
            j = utils.standardJson(req, res);
            var result = results[0].lab_remove_student;
            if (result == 1){
                j = utils.errorJson(req, res, 'DeletionFailed');
            } else if (result == 0) {
                j.operation = {
                   lab: labId,
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

