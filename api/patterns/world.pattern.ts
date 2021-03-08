/** 
 * WORLD PATTERN
 * 
 * This pattern determine floors and world behavior
 */

import { CaseI } from "../interfaces/case.interface";
import { insertOnWorld, findWorld } from "../queries/world.queries";
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
            console.log(row);
                return { 
                    position : [row['x'], row['y']],
                    type : "floor",
                    name : WorldPattern.getFloorName(row['x'], row['y'])}
                })
            ).then( insertRes => {
                if ( insertRes.ops ){

                    const freeCases = insertRes.ops.filter(row => row['name'] === "neutral" ? false : true) ;

                    TreePattern.createRandomTreesOnArray(freeCases, trees => {
                        console.log(trees);
                        MonsterPattern.createRandomMonstersOnArray(freeCases, monsters => {
                            const arrF = arr.map( row => {
                                if ( WorldPattern.isOnNeutral(row.x, row.y) ){
                                    return {...row, type : "floor", name : "neutral"};
                                }else if ( WorldPattern.isOnDesert(row.x, row.y) ) {
                                    return {...row, type : "floor", name : "desert"};
                                }
                                return {...row, type : "floor", name : "deepdesert"};
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
                            return {...row, type : "floor", name : "neutral"};
                        }
                        return {...row, type : "floor", name : "desert" };
                    }));
                }
            }).catch( err => {

                const arrP = arr.map(row=> [row.x,row.y]);
                const fakeRows = arr.map( row => {
                        const name = WorldPattern.getFloorName(row.x,row.y);
                        return {...row, name : name, type : "floor"};
                    })

                findWorld({ position : { $in : arrP }}).then( cursor => {

                    cursor.toArray().then( words => {

                        const arrayFinal = words.map( rowF => {return {...rowF, x : rowF.position[0], y : rowF.position[1] };});
                        fakeRows.forEach( rr => {

                            if ( !arrayFinal.reduce( (acc, r2) => {
                                if ( r2.x === rr.x && r2.y === rr.y ){
                                    acc = true ;
                                }
                                return acc ;
                            },false) ){

                                arrayFinal.push(rr);

                            }

                        });
                        console.log(arrayFinal, fakeRows);

                        callback(fakeRows);
                    });

                })

                // callback(arr.map( row => {
                //     const type = WorldPattern.getFloorType(row.x,row.y);
                //     return {...row, type : type};
                // }));
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
    static isOnDeepDesert = (x: number, y : number ) => {
        if ( !WorldPattern.isOnNeutral(x,y) && WorldPattern.isOnDesert(x,y)){
            return true ;
        }
        return false ;
    }
    static getFloorName = (x:number, y:number) => {
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