#!/usr/bin/env bash

data="subject=TestSubject&content=TestBody&contactemail=TestAccountEmail@foo.gr&accountname=TestAccountName"
curl -d $data http://localhost:3001/contact/sendmail

