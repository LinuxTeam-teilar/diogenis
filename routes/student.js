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

var studentDb = require('../lib/db/student.js');

router.post('/auth', function(req, res) {
    studentDb.auth(req, res);
});

router.post('/add/record', routeMiddleware.isTeacher, function(req, res) {
    studentDb.addRecord(req, res);
});

router.post('/remove/record', routeMiddleware.isTeacher, function(req, res) {
    studentDb.removeRecord(req, res);
});

router.get('/list/labs', routeMiddleware.isStudent, function(req, res) {
    studentDb.listLabs(req, res);
});

router.post('/remove/lab', routeMiddleware.isTeacher, function(req, res) {
    studentDb.removeLab(req, res);
});

router.post('/move', routeMiddleware.isTeacher, function(req, res) {
    studentDb.move(req, res);
});

module.exports = router;

