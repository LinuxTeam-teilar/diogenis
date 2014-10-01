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

var labDb = require('../lib/db/lab.js');

router.post('/create', routeMiddleware.isSecretaryOrTeacher, function(req, res) {
    labDb.create(req, res);
});

router.post('/remove', routeMiddleware.isSecretaryOrTeacher, function(req, res) {
    labDb.remove(req, res);
});

router.get('/list', routeMiddleware.isUser, function(req, res) {
    labDb.list(req, res);
});

router.post('/add/student', routeMiddleware.isStudent, function(req, res) {
    labDb.addStudent(req, res);
});

router.post('/remove/student', routeMiddleware.isSecretaryOrTeacher, function(req, res) {
    labDb.removeStudent(req, res);
});

router.post('/add/laptop', routeMiddleware.isTeacher, function(req, res) {
    labDb.addLaptop(req, res);
});

router.post('/remove/laptop', routeMiddleware.isTeacher, function(req, res) {
    labDb.removeLaptop(req, res);
});

module.exports = router;

