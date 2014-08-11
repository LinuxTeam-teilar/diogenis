#!/usr/bin/env bash

./node_modules/.bin/mocha -t 0 --reporter $1 test/student.js \
                                             test/secretary.js \
                                             test/teacher.js \
                                             test/lesson.js \
                                             test/semester.js \
                                             test/classroom.js

