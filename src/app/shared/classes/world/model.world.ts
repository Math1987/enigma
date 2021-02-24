import { CharaI } from "api/interfaces/chara.interface";
import * as THREE from "three" ;
import { WorldChara } from "./chara.world";
import { WorldRes } from './resources.world' ;

export class WorldModel {

    matKey : string ;
    mesh : THREE.Mesh ;
    
    public get x() {
        return this.mesh.position.x ;
    }
    public get y() {
        return this.mesh.position.y ;
    }
    public set x(px:number) {
        this.mesh.position.x = px ;
    }
    public set y(py : number) {
        this.mesh.position.y = py ;
    }
    public get type(){
        return this.matKey ;
    }
    public set type(type:string){
       
    }



    constructor( matKey = "desert" ){
        this.matKey = matKey ;
    }
    create(scene : THREE.Scene, px, py, params){

        const obj = new WorldModel(this.matKey);
        obj.mesh = new THREE.Mesh(WorldRes.FLOORGEO, WorldRes.MATS[this.matKey].clone() );
        scene.add(obj.mesh);
        obj.x = px ; 
        obj.y = py ;

        return obj ;

    }
    getName(){
        return 'model' ;
    }
    getCharaInteractions(floor:WorldModel, chara: CharaI ){
        return null ;
    }
    select(){
        console.log('select')
        this.mesh.material = WorldRes.MATS['neutral'] ;
        // (this.mesh.material as THREE.MeshBasicMaterial).color(0xffffff) ;
    }
    unselect(){

    }

    update(obj : any){
        for ( let key of Object.keys(obj) ){
            if ( this[key] ){
                this[key] = obj[key];
            }
        }
        return this ;
    }
    move(x : number, y : number ){
        return new Promise( (resove, reject) =>  {
            resove(true);
        })
    }
    destroy(scene : THREE.Scene ){
        // console.log('destroy');
        scene.remove(this.mesh);
    }

}



