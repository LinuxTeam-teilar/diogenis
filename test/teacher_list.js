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
                        classroom: 1,
                        classroomname: "new_unix",
                        day: 1,
                        id: 1,
                        lablimit: 25,
                        lesson: 1,
                        lessonname: "Programming 1",
                        recordspresence: false,
                        students: [
                            {
                                id: 1,
                                isstudentinqueue: false,
                                hasLaptop: false
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

                    var lab = res.body.teacher.labs[0];
                    lab.classroom.should.eql(expected.labs[0].classroom);
                    lab.classroomname.should.eql(expected.labs[0].classroomname);
                    lab.day.should.eql(expected.labs[0].day);
                    lab.id.should.eql(expected.labs[0].id);
                    lab.lablimit.should.eql(expected.labs[0].lablimit);
                    lab.lesson.should.eql(expected.labs[0].lesson);
                    lab.lessonname.should.eql(expected.labs[0].lessonname);
                    lab.recordspresence.should.eql(expected.labs[0].recordspresence);
                    lab.timeend.should.eql(expected.labs[0].timeend);
                    lab.timestart.should.eql(expected.labs[0].timestart);
                    lab.students[0].id.should.eql(expected.labs[0].students[0].id);
                    lab.students[0].haslaptop.should.eql(expected.labs[0].students[0].hasLaptop);
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

