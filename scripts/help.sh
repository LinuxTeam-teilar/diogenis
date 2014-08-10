#!/usr/bin/env bash
cat << EOF
    In order to deploy diogenis you must
        1. install node.js
        2. install postgresql
        3. install redis
        4. start postgresql
        5. start redis
        6. modify the diogenis.conf
        7. make install
        8. make db-create
        9. modify defaultdata.js
        10. make defaultdata
        11. make tools
        12. make start-production
        13. modify test/test_passwords.conf.sample to test/test_passwords.conf (this is optional)
        14. make test

    Steps 13 and 14 are optional and should be used only if you want to execute the tests
EOF

