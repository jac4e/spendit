
"use strict";
import express from 'express';
import {dirname} from 'path';
import { fileURLToPath } from 'url';
// import errorHandler from './_helper/error-handler.js';
import api from './api.controller.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// api routes
app.use('/api', api);

// app route
// app.use(express.static(`${__dirname}/dist/spendit`))
app.get('/', (req,res) => {
  console.log(req)
  // res.sendFile('/dist/repair-pos/index.html',{root: __dirname})
});
app.get('/*', (req,res) => {
  // res.sendFile('/dist/repair-pos/index.html',{root: __dirname})
});

// global error handler
// app.use(errorHandler)

// start server
app.set('port', 3000)
app.listen(3000, () => console.log('Backend listening on port ' + app.get('port')));