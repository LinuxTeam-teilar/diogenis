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

var express = require('express');
var router = express.Router();
var routeMiddleware = require('./middleware.js');

var teacherDb = require('../lib/db/teacher.js');

router.post('/create', routeMiddleware.isSecretary, function(req, res) {
    teacherDb.create(req, res);
});

router.post('/auth', function(req, res) {
    teacherDb.auth(req, res);
});

router.get('/list', routeMiddleware.isUser, function(req, res) {
    teacherDb.listAll(req, res);
});

router.get('/list/students', routeMiddleware.isTeacher, function(req, res) {
    teacherDb.listStudents(req, res);
});

router.post('/remove', routeMiddleware.isSecretary, function(req, res) {
    teacherDb.remove(req, res);
});

module.exports = router;

