
import { Pattern } from "./base.pattern";
import { BuildingI, CapitalI } from "./../interfaces/building.interface";
import { findBuildingsOnPositions, incBuildingValuesData, insertBuildingsDatas } from "./../queries/building.queries";
import { CharaPattern } from "./chara.patterns";
import { CapitalPattern } from "./capital.pattern";

export class BuildingPattern extends Pattern {

    static init(){

        CapitalPattern.init();


    }
    static getBuildingsOnArray( array : {x : number, y : number}[], callback : (buildings : BuildingI[])=>void ){

        findBuildingsOnPositions(array, buildings => {
            callback(buildings);
        });

    };


    constructor(){
        super();
    }

    plunder(attacker : CharaPattern, callback){
        callback(null);
    }

    incrementValues( values, callback){

        incBuildingValuesData(this.obj._id, values).then( res => {
            callback(res.value);
        }).catch( err => {
            callback(null);
        })

    }



}