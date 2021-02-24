/** 
 * BASE PATTERN
 * 
 * This is the base Pattern model. 
 * 
 * Giving bases functions for everywhere
 * Handling socket for realtime
 * And Class with static functions and functions for instances
 * !must not inculde inheriting patterns
 * 
 * @PATTERNS Object containing all the patterns inheriting from pattern
 * @SOCKETS Array containing all the connected users
 * 
 */

import { Socket } from "socket.io";
import { findObjDatasByID } from "../queries/global.queries" ;
import { CalculsI } from "../interfaces/calculs.interface";
import { CharaI } from "../interfaces/chara.interface";
import { findCharaDatasByUserID } from "../queries/chara.queries";

export const PATTERNS : { [name : string]: Pattern} = {} ;
export const SOCKETS : Socket[] = [] ;

export const buildInstanceFromDatas = ( obj:{type:string}, callback : (obj:Pattern|null)=>void ):void => {
    let pattern = null ;
    if ( obj ){
        pattern = PATTERNS[obj.type].build(obj);
        if ( pattern ){
            callback(pattern);
        }else{
            callback(null);
        }
    }else{
        callback(null) ;
    }
}
export const buildInstanceFromId = ( _id : string, callback : (obj:Pattern|null)=>void ):void => {
    let pattern = null ;
    findObjDatasByID(_id , target => {
        if ( target && PATTERNS[target['type']]){
            pattern = PATTERNS[target['type']].build(target);
            if ( pattern ){
                callback(pattern);
            }else{
                callback(null);
            }
        }else{
            callback(null) ;
        }
    });
}

/**
 * GetCalculs:
 * 
 * Send the calculs metadatas
 * used by patterns (for ex to calcul attack, drawwater etc...)
 * 
 */
export const getCalculs = ( callback : (calculs:CalculsI)=>void ):void => {

    callback({
        drawWater : {
            base : 0.25, 
            defense : 0.25,
            defense_log : 0.33,
            desert : 0.08,
            neutral : 0.05,
            well : 0.8 
        },
        hunt : {
            base : 0.25, 
            defense : 0.25,
            defense_log : 0.33,
            desert : 0.08,
            neutral : 0.05,
            well : 0.8 
        },
        lumberjack : {
            base : 0.25, 
            defense : 0.25,
            defense_log : 0.33,
            desert : 0.08,
            neutral : 0.05,
            well : 0.8 
        },
        pray : {
            base : 0.25, 
            defense : 0.25,
            defense_log : 0.33,
            desert : 0.08,
            neutral : 0.05,
            well : 0.8 
        },
        attack : {
            proba_min : 0.7,
            proba_min_hunt : 20,
            proba_hunt : 0.33,
            proba_factor1 : 1.5,
            proba_min_faith : 20,
            proba_faith : 0.33,
            proba_factor2 : 1.5,

            lumberjack_min : 20,
            lumberjack : 0.33,
            dowser_min : 20,
            dowser : 0.33,
            factor : 2.5 
        }
    });

}

/**
 * FixObjDatas
 * util function transform positions array to x,y numbers
 * (and maybe later more values)
 * use to send value for front or to simplify lisibility
 * 
 * @param obj 
 */
export const fixObjDatas = (obj:any):any =>{
    const nobj = {...obj};
    nobj.x = obj.position[0] ;
    nobj.y = obj.position[1] ;  
    if ( obj['level'] ){
        obj['level'] = Math.floor(obj['level']*10)/10 ;
    }
    return nobj ;
}

/**
 * isOnView: 
 * util return true if object is visible in a frontend frame
 * for exemple this function can be used for socket to send updates only if 
 * this object is visible by the user on he navigator 
 */
export const isOnView = ( obj: {x : number,y:number}, x:number, y:number, rayon:number ):boolean => {
    if ( obj.x >= x - rayon && obj.x <= x + rayon && 
        obj.y >= y - rayon && obj.y <= y + rayon ){
            return true ;
        }
        return false ;
}

/**
 * SOCKET FUNCTIONS 
 * 
 * thoses function send update to all connected users
 * for real time player experience.
 */
export const updateSocketsValues = ( position : {x : number, y : number}, datas : any[] ):void => {
    for ( let socket of SOCKETS ){
        const userId = socket.handshake.headers.userId ;
        findCharaDatasByUserID(userId).then(chara => {
            const charaF = fixObjDatas(chara) ;            
            if ( charaF && isOnView(charaF, position.x, position.y, 4) ){
                socket.emit('updateDatas', datas);
            }
        });
    }
}
export const socketsAdd = ( position : {x : number, y : number}, obj : any[] ):void => {
    for ( let socket of SOCKETS ){
        const userId = socket.handshake.headers.userId ;
        findCharaDatasByUserID(userId).then(chara => {
            const charaF = fixObjDatas(chara) ;            
            if ( charaF && isOnView(charaF, position.x, position.y, 4) ){
                socket.emit('add', obj);
            }
        });
    }
}
export const socketsRemove = ( position : {x : number, y : number}, _id : any[] ):void => {

    for ( let socket of SOCKETS ){

        const userId = socket.handshake.headers.userId ;
        findCharaDatasByUserID(userId).then(chara => {

            const charaF = fixObjDatas(chara) ;            
            if ( charaF && isOnView(charaF, position.x, position.y, 4) ){

                socket.emit('removeObj', _id);

            }

        });

    }


}
export const socketsResurrection = ( chara:CharaI ):void => {

    for ( let socket of SOCKETS ){

        const userId = socket.handshake.headers.userId ;

        if ( ''+chara['user'] === ''+userId ){

            const charaF = fixObjDatas(chara) ;            
            socket.emit('resurrection', charaF);

        }


    }

}
export const socketMove = ( _id : string, newX : number, newY : number, oldPosition : {x : number, y: number } ):void => {
    for ( let socket of SOCKETS ){
        const userId = socket.handshake.headers.userId ;
        if ( userId ){
            findCharaDatasByUserID( socket.handshake.headers.userId ).then( chara => {
                if ( chara ){
                    const chara_ = fixObjDatas(chara) ;
                    if ( isOnView(chara_, newX, newY, 5 ) ){
                        if ( 
                            !isOnView(chara_, oldPosition.x, oldPosition.y, 4 ) &&
                            isOnView(chara_, newX, newY, 4 )
                            ){
                            findObjDatasByID(_id, charaMoving => {
                                socket.emit('add', fixObjDatas(charaMoving) );
                            })
                        }else{
                            socket.emit('move', _id, newX, newY);
                        }        
                    }
                }
            });
        }
    }
}

/**
 * Pattern
 * 
 * An instanciable object with behaviors 
 * interacting with database or sockets
 */
export class Pattern {

    static isOnNeutral = ( x : number, y : number) => {
        if ( x >= -2 && x <= 2 && y >= -2 && y <= 2 ){
            return true ;
        }
        return false ;
    }


    /**
     * @obj obj contain the specifics datas of each unique instance in the game
     */
    obj = null ;
    constructor(obj=null){
        this.obj = obj ;
    }
    /**
     * build 
     * create an instance of the Pattern
     * obj datas can be null for PatternHandler usage
     * !this function must be implemented in all inheriting objects
     */
    build(obj=null){
        return new Pattern(obj);
    }
    pass(){}
    makeAction(actionType : string, target : Pattern, callback: CallableFunction ){
        callback({ action : "done"});
    }
    getName(){
        return '' ;
    }
    incrementValues( datas: any, callback : CallableFunction){
        callback(false);
    }
    counterAttack( attacker : Pattern, callback ){

        getCalculs( calculs => {


            let calculation = calculs["attack"];
            let proba_skillAttack = attacker.obj.attack || 10;
            let proba_getFood = attacker.obj.hunter || 10;
            let proba_defense = this.obj.defense || 10 ;
            let proba_getFaith = this.obj.priest || 10 ;

            let proba = Math.max(
              0.05,
              Math.min(
                9.95,
                calculation.proba_min +
                  (Math.log10(proba_skillAttack) +
                    Math.log10(
                      (proba_getFood + calculation.proba_min_hunt) *
                        calculation.proba_hunt
                    ) *
                      calculation.proba_factor1) -
                  (Math.log10(proba_defense) +
                    Math.log10(
                      (proba_getFaith + calculation.proba_min_faith) *
                        calculation.proba_faith
                    ) *
                      calculation.proba_factor2)
              )
            );
            if ( Math.random() > proba ){
                callback(true);
            }else{
                callback(false);
            }

        });
     
    }
    attack( target : Pattern, callback ){

        target.counterAttack(this, counterRes => {

            if ( counterRes ){

                target.hit(this, 0.5, hitRes => {
                    callback({...hitRes, counter : true })
                });

            }else{

                this.hit(target, 1.0, hitRes => {
                    callback({...hitRes, counter : false })
                });

            }

        });

    }
    hit( target : Pattern, power : number, callback ){

        getCalculs( calculs => {

            let calculation = calculs.attack ;
            let D100 = Math.floor(Math.random() * 99 + 1);
            let skillAttack = this.obj.attack || 10 ;
            let getMaterial = this.obj.lumberjack || 10 ;
            let skillDefense = target.obj.defense || 10 ;
            let getWater = target.obj.dowser || 10 ;

            let dammages = Math.max(
              1,
              Math.floor(
                (D100 *
                  (Math.log10(skillAttack) +
                    Math.log10(
                      (getMaterial +
                        calculation.lumberjack_min) *
                        calculation.lumberjack
                    ))) /
                  ((Math.log10(skillDefense) +
                    Math.log10(
                      (getWater + calculation.dowser_min) *
                        calculation.dowser
                    )) *
                    calculation.factor)
              )
            );

            dammages = Math.min( target.obj['life'], dammages*power );

            if ( dammages >= target.obj['life'] ){

                target.die( deathRes => {

                    callback({
                        death : true,
                        D100 : D100,
                        dammage : dammages
                    });
                });

            }else{

                target.incrementValues({ 'life' : -dammages }, targetUpdated => {
                
                    updateSocketsValues({
                        x : this.obj.position[0],
                        y : this.obj.position[1]},[
                            {
                                '_id' : target.obj._id,
                                'life' : targetUpdated.life
                            }
                        ]
                        );
                    
                    callback({ 
                        death : false,
                        D100 : D100,
                        dammage : dammages
                    });
                });
            }
        });
    }
    die( callback ){

        socketsRemove({x: this.obj.position[0], y: this.obj.position[1]}, this.obj._id );
        callback(true);

    }
    

}