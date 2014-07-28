var utils = require('../lib/utils.js');

module.exports.isSecretary = function(req, res, next) {
    if (req.session && req.session.isSecretary) {
        next();
    } else {
        var j = utils.errorJson(req, res, 'UnAuthorized');
        res.statusCode = 401;
        res.json(j);
    }
};

module.exports.isSecretaryOrTeacher = function(req, res, next) {
    if (req.session && (req.session.isSecretary || req.session.isTeacher)) {
        next();
    } else {
        var j = utils.errorJson(req, res, 'UnAuthorized');
        res.statusCode = 401;
        res.json(j);
    }
};

