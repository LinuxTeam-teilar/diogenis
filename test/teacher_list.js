var testUtils = require('./testutils.js');
var should = require('should');

describe('Teacher', function() {

    describe('List students', function() {

        it('Should succeed', function(done) {
            testUtils.authTeacher(function(teacherRes) {
                var expected = {
                    auth: {
                        success: true
                    },
                    error: {
                        id: -1,
                        name: ''
                    }, labs: [{
                        classroomid: 1,
                        classroomname: "new_unix",
                        day: 1,
                        labid: 1,
                        lablimit: 25,
                        lessonid: 1,
                        lessonname: "Programming 1",
                        recordspresence: false,
                        students: [
                            {
                                id: 1,
                                isstudentinqueue: false,
                            }],
                        studentsInQueue: [],
                        timeend: 10,
                        timestart: 8
                    }]
                };

                var opts = {
                    path: 'teacher/list/students',
                    auth: true
                };

                testUtils.getUrl(opts, function(res, body) {
                    res.body.auth.should.eql(expected.auth);
                    res.body.error.should.eql(expected.error);
                    res.body.labs[0].classroomid.should.eql(expected.labs[0].classroomid);
                    res.body.labs[0].classroomname.should.eql(expected.labs[0].classroomname);
                    res.body.labs[0].day.should.eql(expected.labs[0].day);
                    res.body.labs[0].labid.should.eql(expected.labs[0].labid);
                    res.body.labs[0].lablimit.should.eql(expected.labs[0].lablimit);
                    res.body.labs[0].lessonid.should.eql(expected.labs[0].lessonid);
                    res.body.labs[0].lessonname.should.eql(expected.labs[0].lessonname);
                    res.body.labs[0].recordspresence.should.eql(expected.labs[0].recordspresence);
                    res.body.labs[0].timeend.should.eql(expected.labs[0].timeend);
                    res.body.labs[0].timestart.should.eql(expected.labs[0].timestart);
                    res.body.labs[0].studentsInQueue.should.eql(expected.labs[0].studentsInQueue);
                    res.body.labs[0].students[0].id.should.eql(expected.labs[0].students[0].id);
                    done();
                });
            });
        });

        it('UnAuthorized Request', function(done) {
            var expected = {
                auth: {
                    success: false
                },
                error: {
                    id: 2,
                    name: 'UnAuthorized'
                }
            };

            var opts = {
                path: 'teacher/list/students',
                auth: false,
                statusCode: 401
            };

            testUtils.getUrl(opts, function(res, body) {
                res.body.should.eql(expected)
                done();
            });
        });

    });
});

