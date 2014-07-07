module.exports.standardJson = function(req, res) {
    var json = {
        error: '',
        auth: res.session ? true : false
    }

    return json;
}

