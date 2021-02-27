/** 
 * RANK CONTROLLER
 * 
 * provide ranking informations
 * 
 */

import { Request, Response } from "express";
import { findCharasCursor, findSortedCharasCursor } from "../queries/chara.queries";

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


    findCharasCursor({}).then( cl => {
        cl.forEach(element => {
            console.log(element.kills);

            clans[element.clan]['kills'] += element.kills ;

        }).then( result => {

            let final = [] ;
            for ( let c in clans ){
                final.push({...clans[c], clan : c, value: clans[c].kills });
            }
            final = final.sort( ( a, b) => a.kills < b.kills );

            res.status(200).send(final)

        });

    })

}