import { createServer } from './server/server' ;
import { runSocket } from './socket/index.socket';

const path = require('path');
const express = require('express');

/**
 * require controllers & cron system to run system
 */
require('./controlers/index.controller');
require('./cron/cron');

/**
 * create server and configure access, allowing to *, set all OPTIONS requests as OK
 */
console.log('create test server');
const app = express();
const fs = require('fs');
const serverHttp = require('https').createServer({
    key: fs.readFileSync(path.join(__dirname, './ssl/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, './ssl/crt.pem')),
},app);
serverHttp.listen(5000);
app['server'] = serverHttp ;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    next();
});
app.use((req, res, next) => {
    if (req.method === "OPTIONS") {
        res.status(200).send("");
    } else {
        next();
    }
});
const bodyParser = require("body-parser");
app.use(bodyParser.json());

/** 
 * provide backend API, for all req start with "/api/" 
 * & provide socket service
 */
runSocket(app);
const apiRouter = require('./routes/user.route').routes ;
app.use(apiRouter);

/**
 * provide frontend when req is not in "/api/"
 */
app.use(express.static(path.join(__dirname, "publictest")));
app.get("/*", (req, res) => {
  res.sendFile(process.cwd() + "/dist/publictest/index.html");
});

