import { CaseI } from "api/interfaces/case.interface";
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
    public get img(){
        return '' ;
    }
    public set img(type:string){
       
    }
    public datas : {} = {} ;


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

    getInfos( userChara : CharaI, floor : WorldModel, caseObjs : WorldModel[] ){

        return {
            x : this.x,
            y : this.y,
            img : this.img,
            type : this.type,
            name : this.getName(),
            states : this.getStates(),
            interactions : this.getCharaInteractions(floor, userChara, caseObjs),
            datas : this.datas
        }
    }

    getStates(){
        return {} ;
    }
    getCharaInteractions(floor:WorldModel, chara: CharaI, worldObjs? : WorldModel[] ){
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
        for ( let key of Object.keys(obj) ){
            if ( this.datas[key] ){
                this.datas[key] = obj[key];
            }
        }
        if ( !this.datas['inventory'] && obj['inventory'] ){
            this.datas['inventory'] = obj['inventory'] ;
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



