var executeQuery = require('../db.js');
var utils = require('../utils.js');

module.exports.auth = function(req, res) {
    var secretaryName = req.body.username;
    var secretaryPassword = req.body.password;

    var j = {};

    if (!secretaryName || !secretaryPassword) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
    }

    var sqlQuery = "SELECT secretary_auth($1, $2);";
    executeQuery(sqlQuery, [secretaryName, secretaryPassword], function(err, results) {
        if (err === null && results[0].secretary_auth) {
            req.session.secretary = secretaryName;
            j = utils.standardJson(req, res);
        } else {
            j = utils.errorJson(req, res, 'AuthorizationFailed');
        }

        res.json(j)
    });
};

