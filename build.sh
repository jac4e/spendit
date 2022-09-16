#!/bin/bash
# Get script directory
SCRIPT_DIR=$(dirname $(readlink -f $0))

# Check dependicies
echo "Checking dependencies.."
if [[ ! -e $(which envsubst) ]]; then
    echo "envsubst not found, please install the 'gettext' package"
    exit 1
fi

# Need to find a better way to check for dependencies
# this does not work if docker is aliased to podman
if [[ -e $(which docker) ]]; then
    COMPOSE="docker compose"
    if [[ -e $(which docker-compose) ]]; then
        COMPOSE="docker-compose"
    fi
elif [[ -e $(which podman-compose) ]]; then
    COMPOSE="podman-compose"
    # Do setup for podman
    # https://www.redhat.com/sysadmin/user-namespaces-selinux-rootless-containers
    mkdir ${SCRIPT_DIR}/mongodata
    podman unshare chown 999:999 -R mongodata
else
    echo "Container system not found, please install either podman and podman-compose or docker and (optionally) podman-compose"
    exit 1
fi

# Check if acme.sh is installed
    # if not, install...

# Get config variables
source ${SCRIPT_DIR}/setup.sh production

# Build
cd ${SCRIPT_DIR}
$COMPOSE up -d --build