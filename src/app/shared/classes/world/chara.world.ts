import { CharaI } from 'api/interfaces/chara.interface';
import { resolve } from 'dns';
import * as THREE from 'three' ;
import { WorldModel } from "./model.world";
import { WorldRes } from './resources.world';



export class WorldChara extends WorldModel {

    static RACES_SPRITE_COORDS = {
        humanmasculin : {
            left : 0,
            top :  0.136*2.6*2 ,
            width : 0.136,
            height : 0.136*2.6
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
    sexe : string ;
    race : string ;
    clan : string ;
    life : number ;
    lifeMax : number ;
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
        return `/assets/images/${this.race+this.sexe}_illu.png`;
    }
    public set img(img : string){}

    constructor(matKey = "chara"){
        super(matKey);

    }

    getName(){
        return 'inconnu' ;
    }

    create(scene: THREE.Scene, x:number,y:number, params ) {


        if ( params._id && 
            WorldChara.RACES_SPRITE_COORDS[params['race']+params['sexe']] ){

            const obj = new WorldChara(this.matKey);
            obj._id = params._id ;
            obj.sexe = params.sexe ;
            obj.race = params.race ;
            obj.clan = params.clan ;
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
            let rec = WorldChara.RACES_SPRITE_COORDS[params['race']+params['sexe']] ;
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

    getCharaInteractions( floor, chara : CharaI ){

        if ( 
            this.datas.x === chara.x && this.datas.y === chara.y && 
            this.datas['clan'] === chara.clan && 
            this.datas['life'] < this.datas['lifeMax'] && 
            chara.actions > 0 &&
            chara.water >= 5 && 
            chara.food >= 5 ){
            return [
                {
                name : `soigner`,
                icon : "icon-heal",
                action : "heal",
                tooltip : "soigner, coûte 5 eau, 5 nourriture, 1 action"
                }
            ] ;
            }else if (
                this.datas.x === chara.x && this.datas.y === chara.y && 
                this.datas['clan'] !== chara.clan && 
                floor.getName() !== "neutral" 
                ){
                return [
                    {
                    name : `attaquer`,
                    icon : "icon-attack",
                    action : "attack",
                    tooltip : "attaquer, coût 1 action"
                    }
                ] ;
        }

    }


    move(x:number, y:number){

        this.x += x ;
        this.y += y ;

        return new Promise( (resove, reject) =>  {
            resove(true);
        })
    }

}
