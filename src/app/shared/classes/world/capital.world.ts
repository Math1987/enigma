import { WorldModel } from "./model.world";
import * as THREE from "three" ;
import { WorldRes } from "./resources.world";
import { WorldBuilding } from "./building.world";
import { CharaI } from "api/interfaces/chara.interface";
import { WorldChara } from "./chara.world";

export class WorldCapital extends WorldBuilding {

    static BUILDING_COORDS = {
        'clan-1' : {
            left : 0,
            top :  0.5 ,
            width : 0.5,
            height : 0.5
        },
        'clan-2' : {
            left : 0.5,
            top :  0.5 ,
            width : 0.5,
            height : 0.5
        },
        'clan-3' : {
            left : 0,
            top :  0.5 ,
            width : 0.5,
            height : 0.5
        },
        'clan-4' : {
            left : 0.5,
            top :  0 ,
            width : 0.5,
            height : 0.5
        },
    }

    _id : string ;
    clan : string ;
    decal = {
        x : 0.5,
        y : 0.5
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
        return `/assets/images/capital_illu.jpg`;
    }
    public set img(img : string){}
    public get type(){
        return 'capital' ;
    }
    public set type(type:string){}

    constructor(matKey = "capital"){
        super(matKey);
    }
    getName(){
        return "capitale" ;
    }

    create(scene: THREE.Scene, x:number,y:number, params ) {


        if ( params._id ){

            const obj = new WorldCapital(this.matKey);
            obj._id = params._id ;
            obj.datas = params ;

            const geometry = new THREE.BufferGeometry();
            let width = 1.5;
            let height = 1.59 ;
            const vertices = new Float32Array( [
                -width/2, 0,  0,
                width/2, 0,  0,
                width/2, height,  0,
            
                width/2, height,  0,
                -width/2, height,  0,
                -width/2, 0,  0
            ] );
            let rec = WorldCapital.BUILDING_COORDS[params.clan] ;
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
    update(datas : any){
        for ( let key of Object.keys(datas) ){
            if ( this.datas[key] ){
                this.datas[key] = datas[key];
            }
        }
        return super.update(datas);
    }
    updateInfoCaseFromContext(user, charas : WorldChara[], interactions){

        
        for ( let chara of charas ){

            if ( chara['clan'] === this.datas['clan'] && chara['clan'] !== user['clan'] ){
                interactions.splice(0,1);

                interactions.push({
                    name : `${this.datas['mercenaries']}`,
                    icon : 'icon-attack'
                });

            }
        }

    }

}