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

    create(scene : THREE.Scene, px, py, params){

        const obj = new WorldFloor(this.matKey);
        obj.mesh = new THREE.Mesh(WorldRes.FLOORGEO, WorldRes.MATS[this.matKey].clone() );
        scene.add(obj.mesh);
        obj.x = px ; 
        obj.y = py ;

        return obj ;

    }
}