#!/usr/bin/env bash

./node_modules/.bin/mocha -t 0 --reporter $1 test/teacher.js \
                                             test/student.js \
                                             test/secretary.js \
                                             test/lesson.js \
                                             test/classroom.js \
                                             test/lab.js

