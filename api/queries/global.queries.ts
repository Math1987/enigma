import { CharaI } from "../interfaces/chara.interface";
import { MonsterI } from "../interfaces/monster.interface";

import { findMonsterByID, findMonstersOnPosition } from "./monster.queries";
import { findBuildingFromID, findBuildingOnPosition } from "./building.queries";
import { BuildingI } from "../interfaces/building.interface";
import { CaseI } from "../interfaces/case.interface";
import { findWorldByID, findWorldInPositions, findOneOnWorld, findWorldOnPosition } from "./world.queries";
import { convertId } from "../data/index.data";
import { WorldI } from "api/interfaces/world.interface";

/**
 * 
 * Find obj datas by ID 
 * 
 * try to find an object by ID whatever type it is.
 * 
 * @param id 
 * @param callback 
 */
export const findObjDatasByID = (id:any, callback: (obj: WorldI | CharaI | MonsterI | BuildingI )=>void ) => {

    findBuildingFromID(id).then( building => {

        if ( building ){
            callback(building);
        }else{
            findOneOnWorld({_id : convertId(id) }).then( chara => {
                if ( chara ){
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


export const findObjsByPosition = ( x:number, y:number, callback: (objs :(CaseI | CharaI | MonsterI | BuildingI )[])=>void ):void => {

    const apps = [] ;

    findBuildingOnPosition([x,y]).then( building => {

        if ( building ){
            apps.push(building);
        }
        findWorldOnPosition({ type : "chara"},x,y, charas => {
            if ( charas ){
                charas.forEach(row => {
                    apps.push(row) ;
                })
            }
            findMonstersOnPosition(x,y, ()=>{}).then( monsters => {
                if ( monsters ){
                    monsters.forEach( monster => {
                        apps.push(monster);
                    }) ;
                }
                callback(apps);
            });
        });
    });

}