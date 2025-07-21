# Spendit

A simple online webstore for individual initiated non-supervised food purchases.

See:
- [serveit](https://github.com/jac4e/serveit): the node.js typescript backend.
- [typesit](https://github.com/jac4e/typesit): shared types between backend and front end with type validators.

## Setup

In the built client app, the config files in app-settings.development.json and app-settings.production.json must be set to the correct values.

## Running

If you would just like to run a simple local copy just to test the latest version, you can use the included docker compose.

### Development

For active development, it is recommened to have spendit, serveit, and typesit cloned into the same folder.

First, in the package.json for spendit and serveit, replace the typesit version with `file:../typesit`.

Then, follow the setup for serveit [here](https://github.com/jac4e/serveit?tab=readme-ov-file#setup) for the environment variables (those can be placed in a .env file in the root of the serveit folder).

Afterward, run the following commands in separate terminals:

```bash
#typesit
cd typesit
npm build

#spendit
cd spendit
npm i
npm run watch:backend

#serveit
cd serveit
npm i
npm run watch
```

### Production

Usually, the production setup is ran on a linux VM with the following steps:

1. Download latest [serveit](https://github.com/jac4e/serveit/releases/latest/) backend.zip
2. Download latest [spendit](https://github.com/jac4e/spendit/releases/latest/) app.zip
3. Extract the contents of the app zip to the folder you want to store everything
4. Rename the dist folder to app
5. Extract the contents of the backend zip to the same folder you extracted the app zip to
6. Follow the [serveit setup instructions](https://github.com/jac4e/serveit?tab=readme-ov-file#setup), placing the environment variables in a .env file
7. Configure the `app-settings.production.json` file in `app/assets/config/`
8. Follow the [starting serveit instructions](https://github.com/jac4e/serveit?tab=readme-ov-file#starting-the-server) to setup and start the systemd service



