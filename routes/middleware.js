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

var utils = require('../lib/utils.js');

module.exports.isSecretary = function(req, res, next) {
    if (req.session && req.session.isSecretary) {
        next();
    } else {
        var j = utils.errorJson(req, res, 'UnAuthorized');
        res.statusCode = 401;
        res.json(j);
    }
};

module.exports.isTeacher = function(req, res, next) {
    if (req.session && req.session.isTeacher) {
        next();
    } else {
        var j = utils.errorJson(req, res, 'UnAuthorized');
        res.statusCode = 401;
        res.json(j);
    }
};

module.exports.isStudent = function(req, res, next) {
    console.log(req.session)
    if (req.session && req.session.isStudent) {
        next();
    } else {
        var j = utils.errorJson(req, res, 'UnAuthorized');
        res.statusCode = 401;
        res.json(j);
    }
};

module.exports.isSecretaryOrTeacher = function(req, res, next) {
    if (req.session && (req.session.isSecretary || req.session.isTeacher)) {
        next();
    } else {
        var j = utils.errorJson(req, res, 'UnAuthorized');
        res.statusCode = 401;
        res.json(j);
    }
};

module.exports.isUser = function(req, res, next) {
    if (req.session && (req.session.isSecretary ||
                        req.session.isTeacher ||
                        req.session.isStudent)) {
        next();
    } else {
        var j = utils.errorJson(req, res, 'UnAuthorized');
        res.statusCode = 401;
        res.json(j);
    }
};

