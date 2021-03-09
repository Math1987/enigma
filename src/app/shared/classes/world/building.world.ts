import { WorldModel } from "./model.world";
import * as THREE from "three" ;
import { WorldRes } from "./resources.world";
import { WorldChara } from "./chara.world";
import { CharaI } from "../../interfaces/chara.interface";
import { CaseI } from "api/interfaces/case.interface";

export class WorldBuilding extends WorldModel {

    static BUILDINGS_COORDS = {
        capital : {
            left : 0.136*5,
            top :  0.136*2.6*2 ,
            width : 0.136,
            height : 0.136*2.6
        }
    }


    _id : string ;
    clan : string ;
    decal = {
        x : 0,
        y : 0
    }

    datas = null ;

    public get x() {
        return this.mesh.position.x - this.decal.x ;
    }
    public get y() {
        return this.mesh.position.y - this.decal.y ;
    }
    public set x(px:number) {
        this.mesh.position.x = px + this.decal.x ;
    }
    public set y(py : number) {
        this.mesh.position.y = py + this.decal.y ;
    }
    
    public get img(){
        return `/assets/images/capital_illu.png`;
    }
    public set img(img : string){}

    constructor(matKey = "chara"){
        super(matKey);

    }

    create(scene: THREE.Scene, x:number,y:number, params ) {


        if ( params._id ){

            const obj = new WorldBuilding(this.matKey);
            obj._id = params._id ;
            obj.datas = params ;

            const geometry = new THREE.BufferGeometry();
            let width = 1 ;
            let height = 1*2.6 ;
            const vertices = new Float32Array( [
                -width/2, 0,  0,
                width/2, 0,  0,
                width/2, height,  0,
            
                width/2, height,  0,
                -width/2, height,  0,
                -width/2, 0,  0
            ] );
            let rec = WorldBuilding.BUILDINGS_COORDS['capital'] ;
            const uvs = new Float32Array( [
                 rec.left, rec.top,
                 rec.left + rec.width , rec.top,
                 rec.left + rec.width, rec.top + rec.height,
            
                 rec.left + rec.width, rec.top + rec.height,
                 rec.left, rec.top + rec.height,
                 rec.left, rec.top, 
            ] );
    
            geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
            geometry.setAttribute( 'uv', new THREE.BufferAttribute(uvs,2));
    
    
            const material = WorldRes.MATS[this.matKey] ;// new THREE.MeshBasicMaterial( { color: 0xff0000 } );
            material.side = THREE.DoubleSide ;
            const mesh = new THREE.Mesh( geometry, material );
            obj.mesh = mesh ;
    
            material.transparent = true ;
    
            obj.x = x ; 
            obj.y = y ;
            obj.mesh.rotation.x = Math.PI/2 ;
            obj.mesh.rotation.y = Math.PI*0.75 ;
            scene.add(obj.mesh);
            return obj ;
    
        }
        return null ;

    }
    update(obj : any){
        console.log('tree update ok', obj);
        for ( let key of Object.keys(obj) ){
            if ( this[key] ){
                this[key] = obj[key];
            }else if ( this.datas[key] ){
                this.datas[key] = obj[key];
            }
        }
        return this ;
    }

    getCharaInteractions(floor : WorldModel, chara : CharaI, caseObjs : WorldModel[] ){
        super.getCharaInteractions(floor, chara, caseObjs);
    }

    updateInfoCaseFromContext( user : CharaI, charas : WorldChara[], interactions : any[] ){

        for ( let chara of charas ){
            console.log(chara['clan'], this.datas['clan']);
            if ( chara['clan'] === this.datas['clan'] && chara['clan'] !== user['clan'] ){

                // interactions = [{
                //     name : `${this.datas['mercenaries']}`,
                //     icon : ''
                // }]
                // interactions.splice(0,1);

            }
        }

    }

}