/** 
 * WORLD PATTERN
 * 
 * This pattern determine floors and world behavior
 */

import { CaseI } from "../interfaces/case.interface";
import { insertOnWorld, findWorld, findWorldInPositions, addItemOnWorldInventory, findOneAndUpdateWorldById } from "../queries/world.queries";
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

        findWorldInPositions( {}, arr, worlds => {

            const addCases = arr.filter( row => {

                const gotWorld = worlds.reduce( (acc, ww ) => {
                    if ( ww.type === "floor" && 
                        ww.position[0] === row.x &&
                         ww.position[1] === row.y ){

                            acc = true ;
                    }
                    return acc ;
                },false) ;

                if ( gotWorld ){
                    return false ;
                }
                return true ;

            });

            const send = (array) => {

                const finals = array.map( row => {
                    return {...row, x : row.position[0], y : row.position[1]};
                 });

                callback(finals);

            }

            if ( addCases.length > 0 ){

                insertOnWorld(addCases.map( row => {
                    return { 
                        position : [row['x'], row['y']],
                        type : "floor",
                        name : WorldPattern.getFloorName(row['x'], row['y'])}
                    })).then( newCases => {


                    const freeCases = newCases.ops.filter(row => row['name'] === "neutral" ? false : true) ;

                    TreePattern.createRandomTreesOnArray(freeCases, trees => {
                        MonsterPattern.createRandomMonstersOnArray(freeCases, monsters => {
                            monsters.forEach( monster => {
                                    newCases.ops.push(monster);
                            });
                            send([...worlds, ...newCases.ops, ...trees]);
                        });
                    });

                });

            }else{

                send(worlds);

            }
            


        });




        // insertOnWorld( arr.map( row => {
        //         return { 
        //             position : [row['x'], row['y']],
        //             type : "floor",
        //             name : WorldPattern.getFloorName(row['x'], row['y'])}
        //         })
        //     ).then( insertRes => {

        //         console.log('worlds insered', insertRes.ops);

        //         if ( insertRes.ops ){

        //             const freeCases = insertRes.ops.filter(row => row['name'] === "neutral" ? false : true) ;

        //             TreePattern.createRandomTreesOnArray(freeCases, trees => {
        //                 console.log(trees);
        //                 MonsterPattern.createRandomMonstersOnArray(freeCases, monsters => {
        //                     const arrF = arr.map( row => {
        //                         if ( WorldPattern.isOnNeutral(row.x, row.y) ){
        //                             return {...row, type : "floor", name : "neutral"};
        //                         }else if ( WorldPattern.isOnDesert(row.x, row.y) ) {
        //                             return {...row, type : "floor", name : "desert"};
        //                         }
        //                         return {...row, type : "floor", name : "deepdesert"};
        //                     });
        //                     monsters.forEach( monster => {
        //                             arrF.push(monster);
        //                     });
        //                     callback(arrF);
        //                 });
        //             });


        //         }else{
        //             callback(arr.map( row => {
        //                 if ( WorldPattern.isOnNeutral(row.x, row.y) ){
        //                     return {...row, type : "floor", name : "neutral"};
        //                 }
        //                 return {...row, type : "floor", name : "desert" };
        //             }));
        //         }
        //     }).catch( err => {

        //         console.log('worlds no insered', err );


        //         const arrP = arr.map(row=> [row.x,row.y]);
        //         const fakeRows = arr.map( row => {
        //                 const name = WorldPattern.getFloorName(row.x,row.y);
        //                 return {...row, name : name, type : "floor"};
        //             })

        //         findWorld({ position : { $in : arrP }}).then( cursor => {

        //             cursor.toArray().then( words => {

        //                 const arrayFinal = words.map( rowF => {return {...rowF, x : rowF.position[0], y : rowF.position[1] };});
        //                 fakeRows.forEach( rr => {

        //                     if ( arrayFinal.reduce( (acc, r2) => {
        //                         if ( r2.x === rr.x && r2.y === rr.y ){
        //                             acc = true ;
        //                         }
        //                         return acc ;
        //                     },false) ){
        //                         //arrayFinal.push(rr);
        //                     }
        //                 });
        //                 console.log(arrayFinal);

        //                 callback(arrayFinal);
        //             });

        //         })

        //         // callback(arr.map( row => {
        //         //     const type = WorldPattern.getFloorType(row.x,row.y);
        //         //     return {...row, type : type};
        //         // }));
        //     });
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


    addOnInventory(item, callback){

        console.log('adding on inventory', this.obj.name );

        const obj = this.obj.inventory.filter( row => row.name === item.name );
        if ( obj.length <= 0 ){

            addItemOnWorldInventory(this.obj._id, item).then( charaR => {

                callback(charaR.value) ;
            });

        }else{
            
            const req = {$inc : {}}
            req.$inc[`inventory.$[elem].number`] = item.number ;
            const ops = {
                arrayFilters : [
                    {
                        'elem.name' : item['name']
                    }
                ]
            };
            findOneAndUpdateWorldById(this.obj._id, req, ops ).then( newCharaRes => {
                callback(newCharaRes.value) ;
            });
        }


    }

}