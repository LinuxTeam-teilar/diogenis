var executeQuery = require('../db.js');

module.exports.create = function(func, name, universityId) {
    var sqlQuery = "SELECT department_create($1, $2);";
    executeQuery(func, sqlQuery, [name, universityId]);
};

