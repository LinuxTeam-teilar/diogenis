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

module.exports.isTeacher = function(req, res, next) {
    if (req.session && req.session.isTeacher) {
        next();
    } else {
        var j = utils.errorJson(req, res, 'UnAuthorized');
        res.statusCode = 401;
        res.json(j);
    }
};

module.exports.isStudent = function(req, res, next) {
    console.log(req.session)
    if (req.session && req.session.isStudent) {
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

