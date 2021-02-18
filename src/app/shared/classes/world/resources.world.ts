import * as THREE from "three" ;

export class WorldRes {

    static TEXTURES : { [name:string] : THREE.Texture } = {};
    static MATS : { [name:string] : THREE.Material } = {};
    static FLOORGEO : THREE.BoxGeometry ;
    static PLANEGEO : THREE.PlaneGeometry ;

    static init(){

        WorldRes.TEXTURES = {
            "desert" : new THREE.TextureLoader().load( "/assets/images/texture_desert.png" ),
            "deepdesert" : new THREE.TextureLoader().load( "/assets/images/texture_deepdesert.png" ),
            "neutral" : new THREE.TextureLoader().load( "/assets/images/grass.png" ),
            "chara" : new THREE.TextureLoader().load( "/assets/images/world.png" ),
            "arrow" : new THREE.TextureLoader().load("/assets/images/arrow.png")
        };
        WorldRes.FLOORGEO = new THREE.BoxGeometry(0.9,0.9,0.05);
        WorldRes.PLANEGEO = new THREE.PlaneGeometry(4,4);

        WorldRes.MATS = {
            "arrow" : new THREE.MeshBasicMaterial( {map : WorldRes.TEXTURES['arrow'], transparent : true} ),
            "desert" : new THREE.MeshLambertMaterial({ emissiveMap : WorldRes.TEXTURES['desert'], emissive : 0xffffff, emissiveIntensity:1.0}),
            "deepdesert" : new THREE.MeshLambertMaterial({ emissiveMap : WorldRes.TEXTURES['deepdesert'], emissive : 0xffffff, emissiveIntensity:1.0}),
            "neutral" : new THREE.MeshLambertMaterial({ emissiveMap : WorldRes.TEXTURES['neutral'], emissive : 0xffffff, emissiveIntensity:1.0}),
            "chara" : new THREE.MeshBasicMaterial({
                 map : WorldRes.TEXTURES['chara'],
                transparent : true 
            })
        }


        
    }


}