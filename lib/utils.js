module.exports.standardJson = function(req, res) {
    var json = {
        error: {
            name: '',
            id: -1
        }
    };

    json.auth = {
        success: (req.session.isSecretary || req.session.isTeacher) ? true : false
    };

    return json;
}

var errors = {
    AuthorizationFailed: 1,
    UnAuthorized: 2,
    InvalidParameters: 3,
    CreationFailed: 4,
    UpdateFailed: 5,
    AlreadyExists: 6
};

module.exports.errorJson = function(req, res, errorName) {
    if (errors[errorName]) {
        json = {};

        json.error = {
            name: errorName,
            id: errors[errorName]
        }

        json.auth = {
            success: (req.session.isSecretary || req.session.isTeacher) ? true : false
        };

        return json;

    }

    console.log('Error name: %s is invalid', errorName);
    console.trace();
    process.abort();
}

