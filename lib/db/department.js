var executeQuery = require('../db.js');
var utils = require('../utils.js');

module.exports.create = function(req, res) {
    var departmentName = req.query.name;
    var universityId = req.query.universityId;
    var j = utils.standardJson(req, res);

    if (!departmentName || !universityId) {
        j.error = 'Invalid Parameter';
        res.json(j);
    }

    var sqlQuery = "SELECT department_create($1, $2);";

    executeQuery(sqlQuery, [name, universityId], function(err) {
        if (err === null) {
            j.name = departmentName;
            j.universityId = universityId;
        } else {
            j.error = err;
        }

        res.json(j);

    });
};
