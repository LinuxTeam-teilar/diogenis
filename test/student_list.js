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

var testUtils = require('./testutils.js');
var should = require('should');
var dionysosCredentials = testUtils.dionysosCredentials();

describe('Student', function() {

    describe('List labs', function() {

        it('Should succeed', function(done) {
            testUtils.authStudent(function(studentRes) {
                var expected = {
                    auth: {
                        success: true
                    },
                    error: {
                        id: -1,
                        name: ''
                    },
                    student: {
                        department: 1,
                        email: null,
                        id: 1,
                        identity: '(Τ03093)',
                        labsinqueue: '()',
                        labs: [
                            {
                                classroomid: 1,
                                classroomname: 'new_unix',
                                day: 1,
                                id: 1,
                                lablimit: 25,
                                lessonid: 1,
                                lessonname: 'Programming 1',
                                recordspresence: false,
                                teacher: 1,
                                timeend: 10,
                                timestart: 8
                            }
                        ],
                        name: dionysosCredentials.name,
                        username: dionysosCredentials.username
                    }
                };

                var opts = {
                    path: 'student/list/labs',
                    auth: true
                };

                testUtils.getUrl(opts, function(res, body) {
                    res.body.auth.should.eql(expected.auth);
                    res.body.error.should.eql(expected.error);
                    res.body.student.department.should.eql(expected.student.department);
                    res.body.student.id.should.eql(expected.student.id);
                    res.body.student.identity.should.eql(expected.student.identity);
                    res.body.student.labs[0].classroom.should.eql(expected.student.labs[0].classroomid);
                    res.body.student.labs[0].classroomname.should.eql(expected.student.labs[0].classroomname);
                    res.body.student.labs[0].day.should.eql(expected.student.labs[0].day);
                    res.body.student.labs[0].id.should.eql(expected.student.labs[0].id);
                    res.body.student.labs[0].lablimit.should.eql(expected.student.labs[0].lablimit);
                    res.body.student.labs[0].lessonid.should.eql(expected.student.labs[0].lessonid);
                    res.body.student.labs[0].lessonname.should.eql(expected.student.labs[0].lessonname);
                    res.body.student.labs[0].recordspresence.should.eql(expected.student.labs[0].recordspresence);
                    res.body.student.labs[0].timeend.should.eql(expected.student.labs[0].timeend);
                    res.body.student.labs[0].timestart.should.eql(expected.student.labs[0].timestart);
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
                path: 'student/list/labs',
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

