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

module.exports.auth = function(req, res) {
    var secretaryName = req.body.username;
    var secretaryPassword = req.body.password;

    var j = {};

    if (!secretaryName || !secretaryPassword) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT success, departmentId FROM secretary_auth($1, $2);";
    executeQuery(sqlQuery, [secretaryName, secretaryPassword], function(err, results) {
        if (err === null && results[0].success) {
            utils.clearSession(req);
            req.session.isSecretary = true;
            req.session.departmentId = results[0].departmentid;

            j = utils.standardJson(req, res);
            j.user = {
                username: secretaryName,
                email: '',
                departmentId: results[0].departmentid
            };
        } else {
            j = utils.errorJson(req, res, 'AuthorizationFailed');
        }

        res.json(j)
    });
};

