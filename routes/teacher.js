var express = require('express');
var router = express.Router();
var routeMiddleware = require('./middleware.js');

router.post('/auth', routeMiddleware.isSecretary, function(req, res) {
});

module.exports = router;

