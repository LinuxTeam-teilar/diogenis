var executeQuery = require('../db.js');
var utils = require('../utils.js');

module.exports.create = function(func, name) {
    var universityName = req.query.name;
    var j = utils.standardJson(req, res);

    if (!universityName) {
        j.error = 'Invalid parameter';
        res.json(j);
    }

    var sqlQuery = "SELECT university_create($1);";
    executeQuery(sqlQuery, [name], function(err) {
        if (err === null) {
            j.name = universityName;
        } else {
            j.error = err;
        }

        res.json(j)
    });
};

