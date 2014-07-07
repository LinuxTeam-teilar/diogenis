var executeQuery = require('../db.js');

module.exports.create = function(req, res) {
    var departmentName = req.query.name;
    var universityId = req.query.universityId;

    var j = {
        ok: true,
        name: '',
        universityId: -1,
        error: ''
    };

    if (!departmentName || !universityId) {
        j.ok = false;
        j.error = 'Department or university does not exist';
        res.json(j);
    }

    var sqlQuery = "SELECT department_create($1, $2);";

    executeQuery(sqlQuery, [name, universityId], function(err) {
        if (err === null) {
            j.name = departmentName;
            j.universityId = universityId;
        } else {
            j.ok = false,
            j.error = err;
        }

        res.json(j);

    });
};
