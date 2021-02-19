const path = require('path');

let env = {

    portHttp : 4000,
    portHttps : 4001,
    ssl : {
        key : path.join(__dirname, '../keys/ssl/key.pem'),
        crt : path.join(__dirname, '../keys/ssl/crt.pem')
    },
    tokenSsh : {
        key : path.join(__dirname, '../keys/ssh/key'),
        crt : path.join(__dirname, '../keys/ssh/key.pub')
    },
    mongodb : {
        name : "enigmajdr_test"
    }

}

if ( process.env.MODE === "prod" ){
    env = {

        portHttp : 80,
        portHttps : 443,
        mongodb : {
            name : "enigmajdr"
        },
        ssl : {
            key: "/etc/letsencrypt/live/enigmajdr.com/privkey.pem",
            crt: "/etc/letsencrypt/live/enigmajdr.com/fullchain.pem"
        },
        tokenSsh : {
            key : path.join(__dirname, '../keys/ssh/key'),
            crt : path.join(__dirname, '../keys/ssh/key.pub')
        },
    
    }
}

export const Environment = env ;