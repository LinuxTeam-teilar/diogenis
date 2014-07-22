module.exports.standardJson = function(req, res) {
    var json = {
        error: ''
    };

    json.auth = {
        success: req.session ? true : false
    };


    if (req.session.secretary) {
        json.auth.isSecretary = true;
        json.auth.username = req.session.secretary;
    } else if (req.session.teacher) {
        json.auth.isTeacher = true;
        json.auth.username = req.session.teacher;
    }

    return json;
}

var errors = {
    AuthorizationFailed: 1,
    InvalidParemeters: 2,
    CreationFailed: 3
};

module.exports.errorJson = function(req, res, errorName) {
    if (errors[errorName]) {
        json = {};

        json.error = {
            name: errorName,
            id: errors[errorName]
        }

        json.auth = {
            success: req.session.username ? true : false
        };

        return json;

    }

    console.log('Error name: %s is invalid', errorName);
    console.trace();
    process.abort();
}

