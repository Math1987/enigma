/** 
 * RANK CONTROLLER
 * 
 * provide ranking informations
 * 
 */

import { Request, Response } from "express";
import { findSortedCharasCursor } from "../queries/chara.queries";

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