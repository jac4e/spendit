#!/bin/bash
# Get script directory
SCRIPT_DIR=$(dirname $(readlink -f $0))

# Check dependicies
echo "Checking dependencies.."
if [[ ! -e $(which envsubst) ]]; then
    echo "envsubst not found, please install the 'gettext' package"
    exit 1
fi

if [[ -e $(which docker) ]]; then
    COMPOSE="docker compose"
    if [[ -e $(which docker-compose) ]]; then
        COMPOSE="docker-compose"
    fi
elif [[ -e $(which podman-compose) ]]; then
    COMPOSE="podman-compose"
else
    echo "Container system not found, please install either podman and podman-compose or docker and (optionally) podman-compose"
    exit 1
fi

# Get config variables
source ${SCRIPT_DIR}/setup.sh production

# Setup ssl
printf "Do you want a self-signed cert? (yes/no): "
while [[ 1 ]]; do
    read SSL_ANSWER

    if [[ $SSL_ANSWER = "yes" ]]; then
        ## self sign certs
        mkdir -p ${SCRIPT_DIR}/config/ssl
        openssl req -x509 -nodes -newkey rsa:4096 -keyout ${SCRIPT_DIR}/config/ssl/cert.key -out ${SCRIPT_DIR}/config/ssl/cert.pem -sha256 -days 365
        break
    elif [[ $SSL_ANSWER = "no" ]]; then
        printf "Please place your own certs in ${SCRIPT_DIR}/config/ssl/cert.key and ${SCRIPT_DIR}/config/ssl/cert.pem then press enter..."
        read IGNORE
        break
    else
        printf "must be yes or no: "
    fi
done

# Build
$COMPOSE up -d --build