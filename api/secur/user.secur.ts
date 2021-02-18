import { NextFunction, Request, Response } from "express";
import { readFullUserById } from "../queries/user.queries";
import { readToken } from "./token.secur";

export const userSecurMidelwear = (req : Request, res : Response, next : NextFunction ):void => {

    if ( req.headers.authorization ){
        readToken(req.headers.authorization, userId => {
            if ( userId ){
                readFullUserById( userId, user => {
                    if ( user ){
                        req.user = user ;
                        next();
                    }else{
                        res.status(400).send('fail');
                    }
                });
            }else{
                res.status(400).send('fail');
            }
        });
    }else{
        res.status(400).send('fail');
    }

}