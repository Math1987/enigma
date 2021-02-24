/** 
 * WORLD PATTERN
 * 
 * This pattern determine floors and world behavior
 */

import { CaseI } from "../interfaces/case.interface";
import { insertOnWorld } from "../queries/world.queries";
import { Pattern } from "./base.pattern";
import { MonsterPattern } from "./monster.pattern";
import { TreePattern } from "./tree.pattern";

export class WorldPattern extends Pattern{
    
    /**
     * GetCases : provide all the knowed cases from db, 
     * if no case founds, generate it with monster & tree creation probability
     * 
     * @param arr 
     * @param callback 
     */
    static getCases = ( arr : CaseI[], callback ) => {
        insertOnWorld( arr.map( row => {
                return { 
                    position : [row['x'], row['y']],
                     type : WorldPattern.getFloorType(row['x'], row['y'])}
                })
            ).then( insertRes => {
                if ( insertRes.ops ){

                    const freeCases = insertRes.ops.filter(row => row['type'] === "neutral" ? false : true) ;

                    TreePattern.createRandomTreesOnArray(freeCases, trees => {
                        console.log(trees);
                        MonsterPattern.createRandomMonstersOnArray(freeCases, monsters => {
                            const arrF = arr.map( row => {
                                if ( WorldPattern.isOnNeutral(row.x, row.y) ){
                                    return {...row, type : "neutral"};
                                }else if ( WorldPattern.isOnDesert(row.x, row.y) ) {
                                    return {...row, type : "desert"};
                                }
                                return {...row, type : "deepdesert"};
                            });
                            monsters.forEach( monster => {
                                    arrF.push(monster);
                            });
                            callback(arrF);
                        });

                    });


                }else{
                    callback(arr.map( row => {
                        if ( WorldPattern.isOnNeutral(row.x, row.y) ){
                            return {...row, type : "neutral"};
                        }
                        return {...row, type : "desert"};
                    
                    }));
                }
            }).catch( err => {
                callback(arr.map( row => {
                    const type = WorldPattern.getFloorType(row.x,row.y);
                    return {...row, type : type};
                }));
            });
    }
    static isOnNeutral = ( x : number, y : number) => {
        if ( x >= -2 && x <= 2 && y >= -2 && y <= 2 ){
            return true ;
        }
        return false ;
    }
    static isOnDesert = (x: number, y : number ) => {
        if ( Math.sqrt( Math.pow(x,2) +  Math.pow(y,2)) <= 50 ){
            return true ;
        }
        return false ;
    }
    static getFloorType = (x:number, y:number) => {
        if ( WorldPattern.isOnNeutral(x,y)){
            return 'neutral';
        }else if ( WorldPattern.isOnDesert(x,y)){
            return 'desert' ;
        }else{
            return 'deepdesert';
        }
    }
    static getDangerRatio = (x:number,y:number) => {
        return Math.max(0,1-(Math.sqrt( Math.pow(x,2) + Math.pow(y,2))-50)/50) ;
    }


}