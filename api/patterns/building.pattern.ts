
import { Pattern } from "./base.pattern";
import { BuildingI, CapitalI } from "./../interfaces/building.interface";
import { CharaPattern } from "./chara.patterns";
import { findWorldInPositions, incWorldValues } from "../queries/world.queries";


export class BuildingPattern extends Pattern {

    static init(){}
    
    static getBuildingsOnArray( array : {x : number, y : number}[], callback : (buildings : BuildingI[])=>void ){

        findWorldInPositions( {solid : true},array, buildings => {
            callback(buildings as BuildingI[]);
        });

    };

    plunder(attacker : CharaPattern, callback){
        callback(null);
    }

    incrementValues( values, callback){

        incWorldValues(this.obj._id, values).then( res => {
            callback(res.value);
        }).catch( err => {
            callback(null);
        })

    }



}