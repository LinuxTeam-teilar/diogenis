var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render(res.sendfile('index.html', {
        root: process.cwd() + '/client'
    }));
});

module.exports = router;
