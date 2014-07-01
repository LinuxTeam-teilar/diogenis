var executeQuery = require('../db.js');

module.exports.create = function(func, name) {
    var sqlQuery = "SELECT university_create($1);";
    executeQuery(func, sqlQuery, [name]);
};

