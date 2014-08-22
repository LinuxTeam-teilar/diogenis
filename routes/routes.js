var index = require('./index.js');
var secretary = require('./secretary.js');
var teacher = require('./teacher.js');
var lesson = require('./lesson.js');
var student = require('./student.js');
var classroom = require('./classroom.js');
var lab = require('./lab.js');

module.exports = function(app) {
    app.use('/', index);
    app.use('/secretary', secretary);
    app.use('/teacher', teacher);
    app.use('/lesson', lesson);
    app.use('/student', student);
    app.use('/classroom', classroom);
    app.use('/lab', lab)

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

