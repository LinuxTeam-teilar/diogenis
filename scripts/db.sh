#!/usr/bin/env bash

function readConfigurationValue()
{
    local key=$1
    awk -v key="$key" -F "=" '$0 ~ key  {print $2}' diogenis.conf
}

if [ $1 == "create" ]; then
    DATABASE_ADMIN=$(readConfigurationValue "database_admin")
    DATABASE_USER=$(readConfigurationValue "database_user")
    DATABASE=$(readConfigurationValue "database_name")

    dropdb -i -U $DATABASE_ADMIN $DATABASE

    createdb -U $DATABASE_ADMIN -O $DATABASE_USER $DATABASE
fi

