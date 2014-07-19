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
    }

    return json;
}

