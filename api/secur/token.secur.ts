/** 
 * JWT SECUR
 * 
 * provide createToken & readToken function, 
 * based on jsonwebtoken, 
 * using privateKey stored in ssh/key.pub (carefull for prod ;))
 * 
 */


const fs = require('fs') ;
const path = require('path') ;
const jwt = require('jsonwebtoken');
const keyPath = path.join(__dirname,'../ssh', 'key') ;
const environment = require('./../environment/environment').Environment ;

console.log('env', environment);

const privateKey = fs.readFileSync( environment.tokenSsh.key );
const publicKey = fs.readFileSync( environment.tokenSsh.crt );

export const createToken = ( _id : string):string => {
    return jwt.sign({_id:_id}, privateKey, { algorithm: 'RS256'});
}
export const readToken = ( token : string, callback: (decodedToken:string)=>void) => {
    return jwt.verify(token, publicKey, (err, decoded) => {
        if ( decoded && decoded._id ){
            callback(decoded._id);
        }else{
            callback(null);
        }
    });
}