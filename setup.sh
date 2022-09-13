#!/bin/bash
# Script should basically just get user inputs, place them into the templates, then build the docker image

# Help

# Get script directory
SCRIPT_DIR=$(dirname $(readlink -f $0))

# Process Arguements
if [[ $1 != "production" ]] && [[ $1 != "development" ]]; then
    echo "Environment must be 'development' or 'production'."
    exit 1
fi
ENV=$1

# Check dependencies
    # Docker
    # envsubst

# Functions

# Usage: user_prompt [-s] <target_variable>
function user_prompt() {

    # Check for secret and define local variables
    if [[ $1 != "-s" ]] && [[ -z $2 ]]; then
        local var=$1
    elif [[ $1 = "-s" ]] && [[ -z $3 ]]; then
        local secret=$1
        local var=$2
    fi
    local ptr_default=DEFAULT_${var}
    local default=${!ptr_default}

    local message=MSG_${var}
    local ptr_user_input=USER_${var}
    declare ${ptr_user_input}=""

    # Don't prompt if this script is run through automation
    if [[ $CI ]]; then
        export ${var}=${default}
        return
    fi

    # Print message
    printf "${!message}"

    # Read var
    read $secret USER_${var}

    # Print empty line if the read was secret
    # Secret reads don't contain a newline from pressing enter
    if [[ ! -z $secret ]]; then
        echo ""
    fi

    # Set var
    local value=${!ptr_user_input}

    if [[ "${default}" = "randomly generated." ]]; then
        value=$(dd if=/dev/urandom bs=18 count=1 status=none | base64 | tr -d \\n)
        echo "Your password is $value"
    fi
    export ${var}=${value:-${default}}
}

# Set defaults
if [[ $ENV = "production" ]]; then
    # Production defaults
    DEFAULT_DB_HOSTNAME="database"
    DEFAULT_DB_PORT="27017"
    DEFAULT_ADMIN_USER="admin"
    DEFAULT_ADMIN_PASSWORD="randomly generated."
    DEFAULT_ADMIN_FIRST="$DEFAULT_ADMIN_USER"
    DEFAULT_ADMIN_LAST="${DEFAULT_ADMIN_USER}son"
    DEFAULT_ADMIN_EMAIL="admin@admin.ca"
    DEFAULT_BACKEND_URL="api"
elif [[ $ENV = "development" ]]; then
    # Development defaults
    DEFAULT_DB_HOSTNAME="database"
    DEFAULT_DB_PORT="27017"
    DEFAULT_ADMIN_USER="dev"
    DEFAULT_ADMIN_PASSWORD="forthebirds"
    DEFAULT_ADMIN_FIRST="$DEFAULT_ADMIN_USER"
    DEFAULT_ADMIN_LAST="${DEFAULT_ADMIN_USER}son"
    DEFAULT_ADMIN_EMAIL='dev@dev.ca'
    DEFAULT_BACKEND_URL="http://localhost:3001/api"
fi

# Define messages
MSG_DB_HOSTNAME="Enter the database hostname, default is '${DEFAULT_DB_HOSTNAME}': "
MSG_DB_PORT="Enter the database port, default is '${DEFAULT_DB_PORT}': "
MSG_ADMIN_USER="Enter the username for the admin user, default is '${DEFAULT_ADMIN_USER}': "
MSG_ADMIN_FIRST="Enter the username for the admin first name, default is '${DEFAULT_ADMIN_FIRST}': "
MSG_ADMIN_LAST="Enter the username for the admin last name, default is '${DEFAULT_ADMIN_LAST}': "
MSG_ADMIN_PASSWORD="Enter the password for the admin user, default is '${DEFAULT_ADMIN_PASSWORD}' \n\
NOTE: It is highly recommended to use the default \n\
WARNING: This are currently stored in plain text on the server, this may be a potential security risk \n\
         Future versions will improve on this insecurity \n\n\
password: "
MSG_ADMIN_EMAIL="Enter the email for the admin user, default is '${DEFAULT_ADMIN_EMAIL}': "
MSG_BACKEND_URL="Enter the backends url, default is '${DEFAULT_BACKEND_URL}': "

# Prompt user
user_prompt DB_HOSTNAME
user_prompt DB_PORT
user_prompt ADMIN_USER
user_prompt ADMIN_FIRST
user_prompt ADMIN_LAST
user_prompt -s ADMIN_PASSWORD
user_prompt ADMIN_EMAIL
user_prompt BACKEND_URL

# Generate JWT secret
export JWT_SECRET=$(dd if=/dev/urandom bs=96 count=1 status=none | base64 | tr -d \\n)

# Process templates
cat ${SCRIPT_DIR}/templates/backend.ts.template | envsubst > ${SCRIPT_DIR}/client/app/_helpers/backend.ts
cat ${SCRIPT_DIR}/templates/config.js.template | envsubst > ${SCRIPT_DIR}/server/deploy/config.js
