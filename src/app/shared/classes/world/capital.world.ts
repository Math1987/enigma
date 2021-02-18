import { WorldModel } from "./model.world";
import * as THREE from "three" ;
import { WorldRes } from "./resources.world";
import { WorldBuilding } from "./building.world";

export class WorldCapital extends WorldBuilding {

    static BUILDING_COORDS = {
        capital : {
            left : 760/1000,
            top :  0.66 ,
            width : 239/1000,
            height : 0.33
        },
        humanfeminine : {
            left : 0,
            top :  0.136*2.6 ,
            width : 0.136,
            height : 0.136*2.6
        },
        dwarfmasculin : {
            left : 0.136,
            top :  0.136*2.6*2 ,
            width : 0.136,
            height : 0.136*2.6
        },
        dwarffeminine : {
            left : 0.136,
            top :  0.136*2.6 ,
            width : 0.136,
            height : 0.136*2.6
        },
        elfmasculin : {
            left : 0.136*2,
            top :  0.136*2.6*2 ,
            width : 0.136,
            height : 0.136*2.6
        },
        elffeminine : {
            left : 0.136*2,
            top :  0.136*2.6 ,
            width : 0.136,
            height : 0.136*2.6
        },
        vampiremasculin : {
            left : 0.136*3,
            top :  0.136*2.6*2 ,
            width : 0.136,
            height : 0.136*2.6
        },
        vampirefeminine : {
            left : 0.136*3,
            top :  0.136*2.6 ,
            width : 0.136,
            height : 0.136*2.6
        },
    }

    _id : string ;
    clan : string ;
    decal = {
        x : 1,
        y : 1
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

    constructor(matKey = "chara"){
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
            let width = 2.5;
            let height = 2.7 ;
            const vertices = new Float32Array( [
                -width/2, 0,  0,
                width/2, 0,  0,
                width/2, height,  0,
            
                width/2, height,  0,
                -width/2, height,  0,
                -width/2, 0,  0
            ] );
            let rec = WorldCapital.BUILDING_COORDS['capital'] ;
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


}