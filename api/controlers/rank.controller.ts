/** 
 * RANK CONTROLLER
 * 
 * provide ranking informations
 * 
 */

import { CharaI } from "../interfaces/chara.interface";
import { Request, Response } from "express";
import { findSortedCharasCursor } from "../queries/chara.queries";
import { findWorld } from "../queries/world.queries";


export const rankLevelReq = ( req : Request, res : Response):void => {

    findSortedCharasCursor({ level : -1 }).then (cursor => {
        cursor.toArray().then( charas => {
            const final = charas.map(row => {
                return {
                    clan : row.clan,
                    name : row.name,
                    value : row.level.toFixed(1)
                }
            })
            res.status(200).send(final);

        });
    });

}
export const rankKillReq = ( req : Request, res : Response):void => {

    findSortedCharasCursor({ kills : -1 }).then (cursor => {
        cursor.toArray().then( charas => {
            const final = charas.map(row => {
                return {
                    clan : row.clan,
                    name : row.name,
                    value : row.kills
                }
            })
            res.status(200).send(final);
        });
    });

}
export const rankClan = ( req: Request, res : Response ):void => {

    let clans = {
        "clan-1" : {
            kills : 0
        },
        "clan-2" : {
            kills : 0
        },
        "clan-3" : {
            kills : 0
        },
        "clan-4" : {
            kills : 0
        }
    } ;


    findWorld({}).then( cl => {
        
        cl.forEach(element => {
            const el = (element as CharaI) ;

            clans[el.clan]['kills'] += el.kills ;

        }).then( result => {

            let final = [] as CharaI[] ;
            for ( let c in clans ){
                final.push({...clans[c], clan : c, value: clans[c].kills });
            }
            final = final.sort( ( a, b) => { 
                    if ( a.kills < b.kills ){
                        return 1 ;
                    }
                    return -1 ;
                });

            res.status(200).send(final)

        });

    })

}