/*
Copyright 2014 Antonis Tsiapaliokas <antonis.tsiapaliokas@kde.org>
Copyright 2014 Giorgos Tsiapaliokas <giorgos.tsiapaliokas@kde.org>

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 2 of
the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var index = require('./index.js');
var secretary = require('./secretary.js');
var teacher = require('./teacher.js');
var lesson = require('./lesson.js');
var student = require('./student.js');
var classroom = require('./classroom.js');
var lab = require('./lab.js');
var contact = require('./contact.js')
var debug = require('debug')('diogenis');

module.exports = function(app) {
    app.use(function(req, res, next) {
        debug('=====================');
        debug('Start of %s', req.url);

        if (req.method == 'POST' &&
            req.url.indexOf('auth') == -1 &&
            req.url.indexOf('create') == -1) {
            debug('Form data: %s', JSON.stringify(req.body));
        }
        debug('Session Data: %s', JSON.stringify(req.session));
        debug('=====================');
        next();
    });

    app.use('/', index);
    app.use('/secretary', secretary);
    app.use('/teacher', teacher);
    app.use('/lesson', lesson);
    app.use('/student', student);
    app.use('/classroom', classroom);
    app.use('/lab', lab);
    app.use('/contact', contact);

    /// catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    /// error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
};

