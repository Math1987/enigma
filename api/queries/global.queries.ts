import { CharaI } from "../interfaces/chara.interface";
import { MonsterI } from "../interfaces/monster.interface";
import { findCharaDatasByID } from "./chara.queries";
import { findMonsterByID } from "./monster.queries";

/**
 * 
 * Find obj datas by ID 
 * 
 * try to find an object by ID whatever type it is.
 * 
 * @param id 
 * @param callback 
 */
export const findObjDatasByID = (id:any, callback: (obj: CharaI | MonsterI)=>void ) => {
    findCharaDatasByID(id).then( chara => {
        if ( chara ){
            chara['type'] = "chara" ;
            callback(chara);
        }else{
            findMonsterByID(id).then( monster => {
                if ( monster ){
                    monster['type'] = "monster" ;
                    callback(monster);
                }else{
                    callback(null);
                }
            });
        }
    });
}
