import { resolve } from 'dns';
import * as THREE from 'three' ;
import { WorldModel } from "./model.world";
import { WorldRes } from './resources.world';



export class WorldTree extends WorldModel {

    static TREES_SPRITE_COORDS = {
        tree1 : {
            left : 0.136*2,
            top :  0 ,
            width : 0.120,
            height : 0.136*2.6
        },
        tree2 : {
            left : 0.136*3,
            top :  0 ,
            width : 0.136,
            height : 0.136*2.6
        }
    }


    _id : string ;
    decal = {
        x : 0.25,
        y : 0.25
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
        return `/assets/images/tree_illu.png`;
    }
    public set img(img : string){}

    constructor(matKey = "chara"){
        super(matKey);

    }

    getName(){
        return 'tree' ;
    }

    create(scene: THREE.Scene, x:number,y:number, params ) {


        if ( params._id ){

            let tree = "tree" + (1+Math.abs(Math.floor((x)%2)));

            const obj = new WorldTree(this.matKey);
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
            let rec = WorldTree.TREES_SPRITE_COORDS[tree] ;
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


    move(x:number, y:number){

        this.x += x ;
        this.y += y ;

        return new Promise( (resove, reject) =>  {
            resove(true);
        })
    }

}
