/** 
 * PATTERN HANDLER
 * 
 * Handle Patterns and give functions usable from outside
 * See base.patterns for more options
 * !canot be use by Patterns
 * 
 */
import { findCharaDatasByID, findCharaDatasByUserID } from "../queries/chara.queries";
import { PATTERNS, SOCKETS } from "./base.pattern";
import { BuildingPattern } from "./building.pattern";
import { CharaPattern, convertCharaForFrontend } from "./chara.patterns";
import { MonsterPattern } from "./monster.pattern";
import { WorldPattern } from "./world.pattern";
import { initMongoDB } from './../data/index.data';
import { CapitalPattern } from "./capital.pattern";
import { TreePattern } from "./tree.pattern";

initMongoDB( res => {
    console.log('mongodb ok');
    PatternHandler.init();
});




export class PatternHandler {

    static init = ():void => {

        PATTERNS.world = new WorldPattern();
        PATTERNS.chara = new CharaPattern();
        PATTERNS.monster = new MonsterPattern();
        PATTERNS.capital = new CapitalPattern();
        PATTERNS.tree = new TreePattern();


        BuildingPattern.init();
        MonsterPattern.init();
        
    }
    static pass = ():void => {

        CharaPattern.pass();
        MonsterPattern.pass();
        TreePattern.pass();

    }

    /**
     * connectSocket
     * 
     * add the user id in socket to access on datas 
     * and add socket in array to update interactions
     * between players in real time
     * 
     */
    static connectSocket = ( socket, userId ) => {

        socket.handshake.headers.userId = userId ;
        SOCKETS.push(socket);

        socket.on('disconnect', () => {
            for ( let i = SOCKETS.length-1 ; i >= 0 ; i -- ){
                if ( SOCKETS[i] === socket  ){
                    SOCKETS.splice(i,1);
                }
            }
        })

    }

    /**
     * 
     * MoveOnSockets
     * use for real time update when something move
     * send to all connected users, the information of moving
     * 
     * @param _id the id of the object moving (can be anything)
     * @param newX 
     * @param newY 
     * @param oldPosition this is require to know if the obj was in view of users before moving
     */
    static moveOnSockets( _id : string, newX : number, newY : number, oldPosition : {x : number, y: number } ){

        for ( let socket of SOCKETS ){
            const userId = socket.handshake.headers.userId ;
            if ( userId ){
                findCharaDatasByUserID( socket.handshake.headers.userId ).then( chara => {
                    if ( chara ){
                        const chara_ = convertCharaForFrontend(chara) ;
                        if ( CharaPattern.isOnView(chara_, newX, newY, 5 ) ){
                            if ( 
                                !CharaPattern.isOnView(chara_, oldPosition.x, oldPosition.y, 4 ) &&
                                CharaPattern.isOnView(chara_, newX, newY, 4 )
                                ){
                                findCharaDatasByID(_id).then( charaMoving => {
                                    socket.emit('addChara', convertCharaForFrontend(charaMoving) );
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
    static addCharaOnSockets( target ){

        for ( let socket of SOCKETS ){
            const userId = socket.handshake.headers.userId ;
            if ( userId ){
                findCharaDatasByUserID( socket.handshake.headers.userId ).then( chara => {
                    if ( chara ){
                        const chara_ = convertCharaForFrontend(chara) ;
                        if ( CharaPattern.isOnView(chara_, target.x, target.y, 4 ) ){
                            socket.emit('addChara', convertCharaForFrontend(target) );
                        }
                    }
                }).catch( err => {
                    console.log(err);
                });
            } 
        }
    }

}

