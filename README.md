# Spendit

A simple online webstore for individual initiated non-supervised food purchases.

## Development

First run `./setup.sh development` to generate the dev server configuration.

Then run `docker compose -f docker-compose.development.yml -f docker-compose.yml up -d --build` for a dev server. 

Navigate to `http://localhost:4200/`.

The front and backend will automatically reload if you change any of the source files. 

The default username and password is 'dev' and 'forthebirds', respectively.

## Production

Run `./build.sh` to initially deploy the project to a server in a docker container.

It will prompt you to enter config options.

Afterwards, just use standard `docker compose` commands to control the server.
