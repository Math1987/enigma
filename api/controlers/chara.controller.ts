/** 
 * CHARA CONTROLLER
 * 
 * provide:
 * Http Request functions, 
 * ReadChara function,
 * 
 * use Patterns system 
 * 
 */

import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { findCharaDatasByUserID, } from "../queries/chara.queries";
import { CharaI } from "../interfaces/chara.interface";
import { fixObjDatas, buildInstanceFromId } from "../patterns/base.pattern";
import { CharaPattern, convertCharaForFrontend, getCharaPattern } from "../patterns/chara.patterns";
import { PatternHandler } from "../patterns/index.patterns";
import { WorldPattern } from "../patterns/world.pattern";
import { findObjsByPosition } from "../queries/global.queries";
import { createOnWorld, incWorldValues, updateWorldPosition } from "../queries/world.queries";


export const addWorldCaseOnHeader = ( req: Request, res : Response, next : NextFunction ):void => {

    console.log("addWorldCaseCalled" );

    if ( req.user && req.user.chara ){

        findObjsByPosition( req.user.chara.position[0], req.user.chara.position[1], objs => {

            req.worldCase = objs.map( row => fixObjDatas(row)) ;

            next();

        });

    }else{
        next();
    }

}

export const createCharaReq = ( req: Request, res : Response ):void => {

    const user = req.user ;
    if ( 
        req.body && 
        req.body['sexe'] && 
        req.body['race'] && 
        req.body['religion'] &&
        req.body['clan'] && 
        user 
        ){

        getCharaPattern( req.body, chara => {
            const final = {
                ...chara,
                user : user['_id'],
                messages : ['vous apparaîssez.']
            };
            createOnWorld(final, end => {
                if ( end ){
                    res.status(200).send(final);
                    PatternHandler.addCharaOnSockets(final);
                }else{
                    res.status(200).send(null);
                }
            });   
        });
    }else{
        res.status(200).send(null);
    }

}
export const incCharaValueReq = ( req: Request, res : Response ):void => {

    const chara = req.user.chara ;
    const charaId = chara['_id'] ;
    if ( 
        charaId && 
        req.body && 
        req.body['key'] && 
        req.body['inc'] &&
        chara['xp'] >= req.body['inc']
        ){

        const obj = {}
        obj[req.body['key']] = req.body['inc'];
        obj['xp'] = - req.body['inc'];

        incWorldValues( charaId, obj).then( result => {
            if ( result.ok ){
                res.status(200).send(result.value);
            }else{
                res.status(501).send(null);
            }
        });
    }else{
        res.status(400).send(null);
    }

}
export const moveCharaReq = (req: Request, res : Response ):void => {

    const chara = req.user['chara'] ;
    const charaId = chara['_id'] ;
    const mover = req.body ;

    console.log('moving', mover);

    if ( 
        chara &&
        mover && 
        (mover['x'] || mover['y']) && 
        (chara['moves'] > 0 ||
         (
             WorldPattern.isOnNeutral(chara.position[0], chara.position[1]) && 
             WorldPattern.isOnNeutral(chara.position[0] + mover.x, chara.position[1] + mover.y)
         ))
        ){

        const oldPosition = { x : chara.x, y : chara.y };
        updateWorldPosition(charaId, chara.position[0] + mover['x'], chara.position[1] + mover['y'] ).then( newChara => {

            if ( newChara.ok ){
                const charaMoved = fixObjDatas(newChara.value) ;
                const moveIt = (chara) => {
                    PatternHandler.moveOnSockets(chara._id, chara.x, chara.y, oldPosition);
                    res.status(200).send( chara );
                }
                if ( WorldPattern.isOnNeutral(chara.position[0], chara.position[1]) &&
                     WorldPattern.isOnNeutral(chara.position[0] + mover.x, chara.position[1] + mover.y )){
                    moveIt(charaMoved);
                }else{

                    incWorldValues(charaId, {
                        moves : -1
                    }).then( moveRes => {
                        if ( moveRes.ok ){
                            moveIt(fixObjDatas(moveRes.value));                
                        }else{
                            res.status(501).send(null);
                        }
                    })
                }

            }else{
                res.status(500).send({err : 'error'});
            }

        });
    }else{
        res.status(400).send(null);
    }

}
export const actionCharaReq = (req: Request, res : Response ):void => {

    if ( 
        req.user.chara && 
        req.body && req.body['target'] && 
        req.body['action'] 
        ){

        CharaPattern.makeAction(req.worldCase, req.body['action'], req.user.chara, req.body['target'], actionRes => {
            res.status(200).send(actionRes);
        });

    }else{
        res.status(400).send({err : 'need datas'});
    }

}

export const userItemReq = (req:Request, res : Response) :void => {

    console.log('try using item', req.body)
    if ( 
        req.user.chara && 
        req.body && req.body['_id'] && 
        req.body['item'] 
        ){

            buildInstanceFromId(req.user.chara._id, charaM => {

                if ( charaM && charaM instanceof CharaPattern ){

                    charaM.useItem(req.body.item, useRes => {
                        
                        res.status(200).send({itemUse : true});
                        
                        
                    });

                }
                    
            });

            // getCharaPattern(req.user.chara, charaP => {

            //     console.log(charaP);

            //     charaP.useItem(req.body.item, useRes => {

            //         res.status(200).send({itemUse : true});


            //     });

            // })
           


    }else{
        res.status(400).send({err : 'need datas'});
    }
}
export const userDropItemReq = (req:Request, res : Response) : void => {

    if ( 
        req.user.chara && 
        req.body && req.body['target'] && 
        req.body['item']
        ){         

            buildInstanceFromId(req.user.chara._id, charaM => {
                buildInstanceFromId(req.body.target._id, targetM => {

                    console.log('target', req.body.target.type, targetM);

                    if ( charaM && charaM instanceof CharaPattern ){

                        charaM.dropItem(req.body.item, targetM, useRes => {
                            
                            res.status(200).send({itemUse : true});
                            
                        });
    
                    }else{
    
                        res.status(401).send({err : 'need datas'});
    
                    }

                });
            });
        
            
        }else{

            res.status(401).send({err : 'need datas'});
        }

}