#!/bin/bash
# Get script directory
SCRIPT_DIR=$(dirname $(readlink -f $0))

$SCRIPT_DIR/setup.sh production

docker compose up -d --build