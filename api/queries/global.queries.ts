import { CharaI } from "../interfaces/chara.interface";
import { MonsterI } from "../interfaces/monster.interface";

import { findMonsterByID, findMonstersOnPosition } from "./monster.queries";
import { BuildingI } from "../interfaces/building.interface";
import { CaseI } from "../interfaces/case.interface";
import { findWorldByID, findWorldInPositions, findOneOnWorld, findWorldOnPosition } from "./world.queries";
import { convertId } from "../data/index.data";
import { WorldI } from "../interfaces/world.interface";

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

    // findBuildingFromID(id).then( building => {

    //     if ( building ){
    //         callback(building);
    //     }else{

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

    //     }
    // });


}


export const findObjsByPosition = ( x:number, y:number, callback: (objs :(CaseI | CharaI | MonsterI | BuildingI )[])=>void ):void => {

    let apps = [] ;

    // findWorldOnPosition([x,y]).then( building => {

    //     if ( building ){
    //         apps.push(building);
    //     }
        findWorldOnPosition({},x,y).then( charas => {

            const next = () => {
                findMonstersOnPosition(x,y, ()=>{}).then( monsters => {
                    if ( monsters ){
                        monsters.forEach( monster => {
                            apps.push(monster);
                        }) ;
                    }
    
                    callback(apps);
                });
            }

            if ( charas ){
                charas.toArray().then( charaAr => {
                    apps = [...apps, ...charaAr];
                    next();
                })
            }else{
                next();
            }

        });
    // });

}