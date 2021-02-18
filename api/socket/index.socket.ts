import { PatternHandler } from '../patterns/index.patterns';
import { readToken } from '../secur/token.secur';

export const runSocket = (app) => {

    /**
     * Connect socket for User's Chara connection.
     * If user has correct token, connect socket on Pattern System
     */
    const ioChara = require('socket.io')(app['server'], {
        origin: "*:*",
        cors : ['*'],
        path : "/api/user/chara/socket"
    });
    ioChara.on('connection', client => {
        if ( client.handshake.auth.token ){
            readToken(client.handshake.auth.token, userId =>{
                PatternHandler.connectSocket( client, userId) ;
            });
        }
    });
}