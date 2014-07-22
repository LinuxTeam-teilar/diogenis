module.exports.isSecretary = function(req, res, next) {
    if (req.session && req.session.isSecretary) {
        next();
    } else {
        res.redirect('/');
    }
};

