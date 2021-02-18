/** 
 * WORLD CONTROLLER
 * 
 * this is the global world api working on all type of values in the world of enigma.
 * 
 */
import { Request, Response } from "express"
import { CharaPattern } from "../patterns/chara.patterns";
import { MonsterPattern } from "../patterns/monster.pattern";
import { WorldPattern } from "../patterns/world.pattern";

/**
 * GetWorldReq :
 * 
 * send all the objects asked on positions.
 * this should be a protected request ;).
 * 
 * @param req must be POST and contain an array of positions in body as {x : number, y: number} 
 * @param res must send back and array of objects containing at least {x:number,y:number,type:string}
 */
export const getWorldReq = ( req : Request, res : Response ) => {

    const user = req.user ;
    const chara = user['chara'];

    if ( user && chara && req.body && Array.isArray(req.body) ){
        const array = (req.body as any[]) ;
        WorldPattern.getCases(array, floors => {
            let search = [...array] ;
            CharaPattern.getWorldCharasOnArray(search, charas => {
                MonsterPattern.getMonstersOnArray(search, monsters => {
                    res.status(200).send([...floors, ...charas, ...monsters] );
                });
            });
            
        });

    }else{
        res.status(400).send(null);

    }

}