#!/bin/bash
# Get script directory
SCRIPT_DIR=$(dirname $(readlink -f $0))

# Get config variables
source ${SCRIPT_DIR}/setup.sh production

# Setup ssl
printf "Do you need self-signed ssl certs? (yes/no): "
read SSL_ANSWER

if [[ $SSL_ANSWER = "yes" ]]; then 
    ## self sign certs
    mkdir -p ${SCRIPT_DIR}/config/ssl
    openssl req -x509 -nodes -newkey rsa:4096 -keyout ${SCRIPT_DIR}/config/ssl/cert.key -out ${SCRIPT_DIR}/config/ssl/cert.pem -sha256 -days 365
elif [[ $SSL_ANSWER = "no" ]]; then
    printf "Please place your own certs in ${SCRIPT_DIR}/config/ssl/cert.key and ${SCRIPT_DIR}/config/ssl/cert.pem then press enter..."
    read ""
else
    echo "must be yes or no"
    exit 1
fi

# Build
docker compose up -d --build