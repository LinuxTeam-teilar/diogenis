#!/usr/bin/env bash

function readConfigurationValue()
{
    local key=$1
    awk -v key="$key" -F "=" '$0 ~ key  {print $2}' diogenis.conf
}

function psqlExec()
{
    USER=$DATABASE_USER
    if [ $2 == true ]; then
        USER=$DATABASE_ADMIN
    fi

    PGOPTIONS='--client-min-messages=warning' psql -U $USER $DATABASE -f $PWD/db/$1
}

DATABASE_ADMIN=$(readConfigurationValue "database_admin")
DATABASE_USER=$(readConfigurationValue "database_user")
DATABASE=$(readConfigurationValue "database_name")
DATABASE_FILES=("schema/university.sql"
                "api/university.sql"

                "schema/department.sql"
                "api/department.sql"

                "schema/teacher.sql"
                "api/teacher.sql")

if [ $1 == "development" ]; then

    dropdb -U $DATABASE_ADMIN $DATABASE
else
    dropdb -i -U $DATABASE_ADMIN $DATABASE
fi

createdb -U $DATABASE_ADMIN -O $DATABASE_USER $DATABASE

psqlExec "schema/superUserCommands.sql" true
echo $DATABASE_FILES
for i in ${DATABASE_FILES[@]}; do
    echo "**********************************"
    echo "Executing file: $i"
    echo
    psqlExec $i false
    echo
    echo "Done executing file: $i"
    echo "**********************************"
    echo
done

if [ $2 == "use-sample" ]; then
    echo "**********************************"
    echo "Executing Sample!!!"
    psqlExec "sample.sql" false
fi

