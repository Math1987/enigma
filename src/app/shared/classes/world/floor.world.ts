import { CharaI } from "api/interfaces/chara.interface";
import * as THREE from "three" ;
import { METADATAS } from "../../metadatas/metadatas";
import { WorldModel } from "./model.world";
import { WorldRes } from "./resources.world";

export class WorldFloor extends WorldModel{

    // public get type(){
    //     return "floor" ;
    // }
    // public get img(){
    //     return `/assets/images/desert_illu.png`;
    // }
    public get img(){
        return `/assets/images/desert_illu.png`;
    }

    constructor(args?){
        super(args);
    }
    public get type() {
        return 'floor' ;
    }
    datas : {} = null ;

    getName(){
        return this.datas['name'] ;
    }
    getInfos( userChara : CharaI, floor : WorldModel, caseObjs : WorldModel[] ){
        const obj = {...this.datas};
        if ( obj['inventory'] ){
            obj['inventory'] = obj['inventory'].map( row => {
                return {...METADATAS[row.name], datas : row};
            }) ;
        }else{
            obj['inventory'] = [null];
        }
        while ( obj['inventory'].length < 6 ){
            obj['inventory'].push(null);
        }
        return {...obj,...super.getInfos(userChara, floor, caseObjs)};
    }
    getCharaInteractions(floor:WorldModel, chara: CharaI ){
        if ( chara.position[0] === floor.x && chara.position[1] === floor.y ){


            const datas = [];
            if ( chara.searches > 0 ){
                datas.push(METADATAS.search);
            }
            if ( chara.actions > 0 ){

                if ( chara.water < chara.waterMax ){
                    datas.push(                {
                        name : `puiser de l'eau`,
                        icon : "icon-water",
                        action : `puiser de l'eau`,
                        tooltip : "coût 1 action"
                        });
                }
                if ( chara.food < chara.foodMax ){
                    datas.push(                {
                        name : "chasser", 
                        icon : "icon-attack",
                        action : `chasser`,
                        tooltip : "coût 1 action"
                        });
                }
                if ( chara.wood < chara.woodMax ){
                    datas.push({
                        name : `bûcheronner`,
                        icon : "icon-wood",
                        action : `bûcheronner`,
                        tooltip : "coût 1 action"
                        })
                }
                if ( chara.faith < chara.faithMax ){
                    datas.push({
                        name : "prier",
                        icon : "icon-pray",
                        action : "prier",
                        tooltip : "coût 1 action"
                        });
                }
            }
            return datas ;
        }else{
            return null ;
        }
    }

    create(scene : THREE.Scene, px, py, params){

        const obj = new WorldFloor(params.name);
        obj.mesh = new THREE.Mesh(WorldRes.FLOORGEO, WorldRes.MATS[params.name].clone() );
        scene.add(obj.mesh);
        obj.x = px ; 
        obj.y = py ;
        obj.datas = params ;

        if ( obj.datas['inventory'] ){
            console.log('A FLOOR GOT INVENTORY', obj.datas);
        }

        
        return obj ;

    }
}