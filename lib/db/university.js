var executeQuery = require('../db.js');

module.exports.create = function(func, name) {
    var universityName = req.query.name;

    var j = {
        ok: true,
        name: '',
        error: ''
    };

    if (!universityName) {
        j.ok = false;
        j.error = 'Invalid parameter';
        res.json(j);
    }

    var sqlQuery = "SELECT university_create($1);";
    executeQuery(sqlQuery, [name], function(err) {
        if (err === null) {
            j.name = universityName;
        } else {
            j.ok = false;
            j.error = err;
        }

        res.json(j)
    });
};

