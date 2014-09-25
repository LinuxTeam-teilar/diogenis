var express = require('express');
var router = express.Router();

var contact = require('../lib/contact.js');

router.post('/sendmail', function(req, res) {
    contact.sendMail(req, res);
});

module.exports = router;

