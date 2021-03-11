/**
 * USER CONTROLLER
 * 
 * httpRequest: Create, Login, Secure route
 * functions : read User
 * 
 * use bcrypt to hash password and verify
 * use JWT 
 * 
 */
import { Response, Request } from "express";
import { createUserDatas, findUserDatasByEmail } from "../queries/user.queries";
import { readFullUserById } from "../queries/user.queries";
import { createToken } from "../secur/token.secur";


const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * Midelwear JWT
 * 
 * Check if user have a valid token in header.
 * If yes: read user from DB and put it on req.headers and go next.
 * If not: kik out with error 400.
 */


/**
 * create User (without chara).
 */
export const createUserReq = (req : Request, res : Response ):void => {

    if ( req && req.body && req.body.email && req.body.password ){
        bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(req.body.password, salt, ( err2, hash) => {
                const userDatas = {...req.body, password : hash };
                createUserDatas(userDatas, user => {
                    if ( user ){
                        const token = createToken(user['_id']);
                        res.status(200).send({...user, token : token});
                    }else{
                        res.status(400).send({
                            error : 'fail',
                            message : 'cet email est déjà pris.'
                        });
                    }
                });
            });
        });       
    }else{
        res.status(400).send('need datas');
    }

}
/**
 * read user only after secur midlewear. Simply send user in header.
 */
export const readUserReq = (req: Request, res : Response ) => {

    console.log('readUser', req.user);
    if ( req.user ){
        res.status(200).send(req.user);
    }else{
        res.status(501).send({err : 'user can be read'});
    }
}
/**
 * login user:
 * 
 * if user found and password ok, create token and send user.
 */
export const loginUserReq = (req : Request, res : Response ) => {

    console.log('loginUser', req.body);


    if ( req && req.body && req.body.email && req.body.password ){
        findUserDatasByEmail( req.body.email ).then( datas => {
            console.log(datas);

            if ( datas ){
                bcrypt.compare(req.body.password, datas.password, (errCrypt, resultP) => {
                    if ( resultP ){
                        const token = createToken(datas['_id']);
                        readFullUserById( '' + datas['_id'], user => {
                            if ( user ){
                                const final = {...datas, ...user, token : token} ;
                                res.status(200).send( final);
                            }else{
                                res.status(400).send( null);
                            }          
                        });
                    }else{
                        res.status(400).send({err : 'wrong password'});
                    }
                });
            }else{
                res.status(200).send(null);
            }
        });
    }else{
        res.status(400).send('need datas');
    }

}

