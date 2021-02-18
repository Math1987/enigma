const http = require("http");
const https = require("https");

import express from "express";
import { Request, Response } from "express";
const environment = require('./../environment/environment').Environment ;
const fs = require("fs");

export const createServer = () => {

    const app = express();

    /**
     * redirection of http request on https
     */
    const serverHttp = http.createServer((req : Request, res: Response) => {
        res.writeHead(301, {
          Location: `https://${req.headers.host}${req.url}`,
        });
        res.end();
      });
      serverHttp.listen(environment.portHttp) ;
      /**
       * create https with ssl used from environment (dev or prode)
       */
      const serverHttps = https.createServer(
        {
          key: fs.readFileSync(environment.ssl.key),
          cert: fs.readFileSync( environment.ssl.crt),
        },
        app
      );
      serverHttps.listen(environment.portHttps);
      app['server'] = serverHttps ;
      return app ;

}
