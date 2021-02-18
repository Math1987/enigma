import { resolve } from 'dns';
import * as THREE from 'three' ;
import { WorldModel } from "./model.world";
import { WorldRes } from './resources.world';



export class WorldMonster extends WorldModel {

    static RACES_SPRITE_COORDS = {
        squeleton : {
            left : 0,
            top :  0,
            width : 0.136,
            height : 0.136*2.6
        }
    }


    _id : string ;
    life : number ;
    lifeMax : number ;
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
        return `/assets/images/squeleton_illu.png`;
    }
    public set img(img : string){}
    public get type(){
        return 'monster' ;
    }
    public set type(type:string){}

    constructor(matKey = "squeleton"){
        super(matKey);
    }

    getName(){
        return 'monster' ;
    }

    create(scene: THREE.Scene, x:number,y:number, params ) {

        console.log('create monster');

        if ( params._id ){

            const obj = new WorldMonster(this.matKey);
            obj._id = params._id ;
            obj.life = params.life ;
            obj.lifeMax = params.lifeMax ;
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
            let rec = WorldMonster.RACES_SPRITE_COORDS['squeleton'] ;
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
    
    
            const material = WorldRes.MATS['chara'] ;// new THREE.MeshBasicMaterial( { color: 0xff0000 } );
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


    move(x:number, y:number){

        this.x += x ;
        this.y += y ;

        return new Promise( (resove, reject) =>  {
            resove(true);
        })
    }

}
