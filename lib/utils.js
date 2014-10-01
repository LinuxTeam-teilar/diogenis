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

module.exports.standardJson = function(req, res) {
    var json = {
        error: {
            name: '',
            id: -1
        }
    };

    json.auth = {
        success: (req.session.isSecretary ||
                  req.session.isTeacher ||
                  req.session.isStudent) ? true : false
    };

    return json;
}

var errors = {
    AuthorizationFailed: 1,
    UnAuthorized: 2,
    InvalidParameters: 3,
    CreationFailed: 4,
    UpdateFailed: 5,
    AlreadyExists: 6,
    NotExist: 7,
    DeletionFailed: 8,
    DbError: 9,
    ClassroomAlreadyUsed: 10,
    MoveFailed: 11,
    MailFailed: 12
};

module.exports.errorJson = function(req, res, errorName) {
    if (errors[errorName]) {
        json = {};

        json.error = {
            name: errorName,
            id: errors[errorName]
        }

        json.auth = {
            success: (req.session.isSecretary ||
                      req.session.isTeacher ||
                      req.session.isStudent) ? true : false
        };

        return json;

    }

    console.log('Error name: %s is invalid', errorName);
    console.trace();
    process.abort();
}

module.exports.clearSession = function(req) {
    if (!req.session) {
        return;
    }

    var entries = [
        "isTeacher",
        "isStudent",
        "isSecretary",
        "departmentId",
        "teacherId",
        "studentId"
    ];

    for (var i in entries) {
        var entry = entries[i];
        if (req.session[entry]) {
            delete req.session[entry];
        }
    }
}

