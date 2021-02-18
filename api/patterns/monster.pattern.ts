/**
 * MONSTER PATTERN
 * 
 * Handle all monsters behavior
 */

import { 
    deleteMonsterData,
    findMonstersCursor,
    findMonstersOnArrays,
    incMonsterValuesData,
    insertMonsters,
    updateMonsterPositionDatas
 } from "../queries/monster.queries";
import { findRandomPlaceOn, findWorld } from "../queries/world.queries";
import { fixObjDatas, Pattern, socketMove } from "./base.pattern";
import { WorldPattern } from "./world.pattern";

export class MonsterPattern extends Pattern {


    static getMonsterMetaDatas( callback ){
        callback({
            squeletons : {
                ratio : 0.033
            }
        })
    }

    static init(){}
    static getMonstersOnArray(arrayPos : {x:number, y:number}[], callback ){

        findMonstersOnArrays( arrayPos, monsters => {

            let monsterF = monsters;
            monsterF = monsterF.map(row => {
                return fixObjDatas({...row, type : 'monster'}) ;
            });

            callback(monsterF);

        });
    }
    static createRandomMonstersOnArray(arr : any[], callback){

        this.getMonsterMetaDatas( metadatas => {

            const monsters = [] ;
            arr.forEach( row => {
    
                let ratio = metadatas.squeletons.ratio ;

                if ( !WorldPattern.isOnDesert(row['position'][0], row['position'][1]) ){
                    ratio *= 1 + (3 - WorldPattern.getDangerRatio(row['position'][0], row['position'][1])*3)  ;
                }

                if ( Math.random() <= ratio){
                    monsters.push( MonsterPattern.createMonsterObj(row['position'][0], row['position'][1]));
                }
    
            });
    
            if ( monsters.length > 0 ){
                insertMonsters ( monsters ).then( monstersRes => {
    
                    if ( monstersRes.ops ){
                        callback( monstersRes.ops);
                    }else{
                        callback([]);
                    }
                    
                });
            }else{
                callback([]);
            }
    

        });

    }
    static createMonster(x, y, callback){
        const monster = this.createMonsterObj(x,y);
        insertMonsters([monster]).then( res => {
            callback(res);
        }).catch(err => {
            callback(null);
        })
    }
    static createMonsterObj( x : number, y : number ){
        return {
            position : [x,y],
            life : 50,
            lifeMax : 50,
            attack : 10,
            defense : 10,
        }
    }
    static generateRandomMonster(){

        findRandomPlaceOn({ type : "desert"}).then( randomPlace => {
            randomPlace.forEach(element => {
                this.createMonster( element.position[0], element.position[1], cb => {});
            });

        });
    }
    static pass(){

        this.getMonsterMetaDatas( metadatas => {

            findMonstersCursor().then( cursor => {

                cursor.forEach(monster => {

                    const mx = -1 + Math.floor(Math.random()*2) ;
                    const my = -1 + Math.floor(Math.random()*2)  ;

                    updateMonsterPositionDatas(
                        monster['_id'],
                        monster['position'][0] + mx,
                        monster['position'][1] + my );

                        socketMove(
                            monster['_id'],
                            monster['position'][0] + mx,
                            monster['position'][1] + my,
                            {
                                x : monster['position'][0],
                                y : monster['position'][1]
                            }
                            );

                });

            });

            /** 
             * Generate monster from ratio
             * this function need more precisions 
             * (to simplify, generate squeletons from global values 
             * whitout taking care of cases types as desert or deepdesert)
             */
            findMonstersCursor().then( cursor => {
                cursor.count().then( numberOfSqueletons => {

                    findWorld().then( cursorW => {
                        cursorW.count().then( numberW => {
 
                            const numberNeeded = Math.max(0,Math.ceil((numberW - 16)*metadatas.squeletons.ratio*1.5)-numberOfSqueletons);

                            for ( let i = 0 ; i < numberNeeded ; i ++ ){

                                this.generateRandomMonster();

                            }

                        });
                    });
                });
            });

        });


    }

    constructor(args?){
        super(args);
    }

    build(obj = null){
        const patt = new MonsterPattern(obj);
        return patt ;
    }
    incrementValues(datas, callback){

        incMonsterValuesData( this.obj._id, datas).then( res => {
            if ( res.ok ){
                callback(res.value);
            }else{
                callback(null);

            }
        }).catch( err => callback(null));
    }
    die(callback){

        deleteMonsterData(this.obj._id).then( () => {
            super.die(callback);
        });

    }

}