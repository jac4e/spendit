#!/bin/bash
# Script should basically just get user inputs, place them into the tempaltes, then build the docker image

SCRIPT_DIR=$(dirname $(readlink -f $0))

# Help

# Check dependencies
    # Docker
    # envsubst

# Get user prompts

DEFAULT_DB_HOSTNAME="database"
DEFAULT_DB_PORT="27017"
DEFAULT_ADMIN_USER="admin"
DEFAULT_BACKEND_PORT="3000"

# DB_HOSTNAME
echo "Enter the database hostname, default is '${DEFAULT_DB_HOSTNAME}'."
read DB_HOSTNAME
if [[ -z "$DB_HOSTNAME" ]]; then
    export DB_HOSTNAME=$DEFAULT_DB_HOSTNAME
fi

# DB_PORT
echo "Enter the database port, default is '${DEFAULT_DB_PORT}'."
read DB_PORT
if [[ -z "$DB_PORT" ]]; then
    export DB_PORT=$DEFAULT_DB_PORT
fi

# ADMIN_USER
echo "Enter the username for the admin user, default is '${DEFAULT_ADMIN_USER}'"
read ADMIN_USER
if [[ -z "$ADMIN_USER" ]]; then
    export ADMIN_USER=$DEFAULT_ADMIN_USER
fi
export ADMIN_FIRST=$ADMIN_USER
export ADMIN_LAST="${ADMIN_USER}son"

# ADMIN_PASSWORD
echo "Enter the password for $ADMIN_USER, default is randomly generated"
echo "NOTE: It is highly recommended to use the default"
echo "WARNING: This are currently stored in plain text on the server, this may be a potential security risk"
echo "         Future versions will improve on this insecurity."
read -s ADMIN_PASSWORD
echo ""
if [[ -z "$ADMIN_PASSWORD" ]]; then
    export ADMIN_PASSWORD=$(dd if=/dev/urandom bs=18 count=1 status=none | base64)
fi

# ADMIN_EMAIL
echo "Enter the email for $ADMIN_USER, default is '${ADMIN_USER}@adminworld.it'"
read ADMIN_EMAIL
if [[ -z "$ADMIN_EMAIL" ]]; then
    export ADMIN_EMAIL="${ADMIN_USER}@adminworld.it"
fi

# BACKEND_PORT
echo "Enter the backends port, default is '${DEFAULT_BACKEND_PORT}'"
read BACKEND_PORT
if [[ -z "$BACKEND_PORT" ]]; then
    export BACKEND_PORT=$DEFAULT_BACKEND_PORT
fi

# JWT_SECRET
echo "Enter a JWT secret, default is randomly generated"
echo "NOTE: It is highly recommended to use the default"
echo "WARNING: This are currently stored in plain text on the server, this may be a potential security risk"
echo "         Future versions will improve on this insecurity."
read -s JWT_SECRET
echo ""
if [[ -z "$JWT_SECRET" ]]; then
    export JWT_SECRET=$(dd if=/dev/urandom bs=96 count=1 status=none | base64)
fi

# Process templates

# cat ${SCRIPT_DIR}/templates/backend.ts.template | envsubst > ${SCRIPT_DIR}/client/app/_helpers/backend.ts
cat ${SCRIPT_DIR}/templates/config.js.template | envsubst > ${SCRIPT_DIR}/server/deploy/config.js

# build image
docker compose build

echo "start spendit with 'docker compose up -d'" 