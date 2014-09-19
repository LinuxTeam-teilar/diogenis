module.exports.standardJson = function(req, res) {
    var json = {
        error: {
            name: '',
            id: -1
        }
    };

    json.auth = {
        success: (req.session.isSecretary ||
                  req.session.isTeacher ||
                  req.session.isStudent) ? true : false
    };

    return json;
}

var errors = {
    AuthorizationFailed: 1,
    UnAuthorized: 2,
    InvalidParameters: 3,
    CreationFailed: 4,
    UpdateFailed: 5,
    AlreadyExists: 6,
    NotExist: 7,
    DeletionFailed: 8,
    DbError: 9,
    ClassroomAlreadyUsed: 10
};

module.exports.errorJson = function(req, res, errorName) {
    if (errors[errorName]) {
        json = {};

        json.error = {
            name: errorName,
            id: errors[errorName]
        }

        json.auth = {
            success: (req.session.isSecretary ||
                      req.session.isTeacher ||
                      req.session.isStudent) ? true : false
        };

        return json;

    }

    console.log('Error name: %s is invalid', errorName);
    console.trace();
    process.abort();
}

module.exports.clearSession = function(req) {
    if (!req.session) {
        return;
    }

    var entries = [
        "isTeacher",
        "isStudent",
        "isSecretary",
        "departmentId",
        "teacherId",
        "studentId"
    ];

    for (var i in entries) {
        var entry = entries[i];
        if (req.session[entry]) {
            delete req.session[entry];
        }
    }
}

