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
                email: ''
            };
        } else {
            j = utils.errorJson(req, res, 'AuthorizationFailed');
        }

        res.json(j)
    });
};

