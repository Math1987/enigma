import { CharaI } from "api/interfaces/chara.interface";
import * as THREE from "three" ;
import { WorldModel } from "./model.world";
import { WorldRes } from "./resources.world";

export class WorldFloor extends WorldModel{

    // public get type(){
    //     return "floor" ;
    // }
    // public get img(){
    //     return `/assets/images/desert_illu.png`;
    // }
    img = `/assets/images/desert_illu.png`;

    constructor(args?){
        super(args);
    }
    public get type() {
        return 'floor' ;
    }

    getName(){
        return this.matKey ;
    }
    getCharaInteractions(floor:WorldModel, chara: CharaI ){
        if ( chara.actions > 0 && chara.position[0] === floor.x && chara.position[1] === floor.y ){
            const datas = [];
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

            return datas ;
        }else{
            return null ;
        }
    }

    create(scene : THREE.Scene, px, py, params){

        const obj = new WorldFloor(this.matKey);
        obj.mesh = new THREE.Mesh(WorldRes.FLOORGEO, WorldRes.MATS[this.matKey].clone() );
        scene.add(obj.mesh);
        obj.x = px ; 
        obj.y = py ;

        return obj ;

    }
}