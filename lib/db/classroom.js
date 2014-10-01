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
    var classroomName = req.body.name;

    var j = {};

    if (!classroomName) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT classroom_create($1);";
    executeQuery(sqlQuery, [classroomName], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'DbError');
        } else {
            j = utils.standardJson(req, res);
            j.classroom = results[0].classroom_create;
            if (j.classroom.name != classroomName) {
                j = utils.errorJson(req, res, 'CreationFailed');
            }
        }

        res.json(j);
    });
};

module.exports.remove = function(req, res) {
    var classroomId = req.body.classroom;

    var j = {};

    if (!classroomId) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT classroom_remove($1);";
    executeQuery(sqlQuery, [classroomId], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'DbError');
        } else {
            var status = results[0].classroom_remove;
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

module.exports.rename = function(req, res) {
    var newClassroomName = req.body.name;
    var classroomId = req.body.id;

    var j = {};

    if (!newClassroomName || !classroomId) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT classroom_change_name($1, $2);";
    executeQuery(sqlQuery, [classroomId, newClassroomName], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'DbError');
        } else {
            j = utils.standardJson(req, res);
            j.classroom = results[0].classroom_change_name;
            if (j.classroom.name != newClassroomName ||
                j.classroom.id != classroomId) {
                j = utils.errorJson(req, res, 'UpdateFailed');
            }
        }

        res.json(j);
    });
};

module.exports.listAll = function(req, res) {
    var j = {};

    var sqlQuery = "SELECT id, name FROM classroom;";

    executeQuery(sqlQuery, [], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'DbError');
        } else {
            j = utils.standardJson(req,res);
            if (results.length === 0) {
                j.classrooms = [];
            } else {
                j.classrooms = results;
            }
        }

        res.json(j);
    });
}

