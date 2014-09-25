var utils = require('./utils.js');
var fs = require('fs');
var ini = require('ini');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

module.exports.sendMail = function(req, res) {
    var subject = req.body.subject;
    var body = req.body.content;
    var contactEmail = req.body.contactemail;
    var accountName = req.body.accountname;

    var j = {};

    if (!subject || !body || !contactEmail || !accountName) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var config = ini.parse(fs.readFileSync(process.cwd() + '/diogenis_mail.conf', 'utf-8'));

    var options = {
        host: config.mail.host,
        port: config.mail.port,
        auth: {
            user: config.mail.auth_username,
            pass: config.mail.auth_password
        }
    };

    var transporter = nodemailer.createTransport(smtpTransport(options))

    config.mail.to += ',' + contactEmail;
    console.log(config.mail.to)
    var mailOptions = {
        from: config.mail.from,
        to: config.mail.to,
        subject: 'Diogenis Support - ' + subject,
        text: body
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            j = utils.errorJson(req, res, 'MailFailed');
        } else {
            console.log('Message sent: ' + info.response);
            j = utils.standardJson(req, res);
            j.operation = {
                status: 'ok'
            };
        }

        res.json(j);
    });
};


