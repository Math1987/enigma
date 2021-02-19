import { CharaI } from "../interfaces/chara.interface";
import { MonsterI } from "../interfaces/monster.interface";
import { findCharaDatasByID } from "./chara.queries";
import { findMonsterByID } from "./monster.queries";
import { findBuildingFromID } from "./building.queries";
import { BuildingI } from "api/interfaces/building.interface";

/**
 * 
 * Find obj datas by ID 
 * 
 * try to find an object by ID whatever type it is.
 * 
 * @param id 
 * @param callback 
 */
export const findObjDatasByID = (id:any, callback: (obj: CharaI | MonsterI | BuildingI )=>void ) => {

    findBuildingFromID(id).then( building => {
        if ( building ){
            callback(building);
        }else{
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
    });


}
