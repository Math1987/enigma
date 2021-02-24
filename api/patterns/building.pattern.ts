
import { Pattern } from "./base.pattern";
import { BuildingI, CapitalI } from "./../interfaces/building.interface";
import { findBuildingsOnPositions, incBuildingValuesData, insertBuildingsDatas } from "./../queries/building.queries";
import { CharaPattern } from "./chara.patterns";

export class BuildingPattern extends Pattern {

    static init(){

        const startMercenary = 10 ;
        const dist = 20 ;

        const capitales : CapitalI[] = [
            {
                position : [-dist,0],
                type : "capital",
                clan : "clan-1",
                mercenaries : startMercenary
            },
            {
                position : [0,-dist],
                type : "capital",
                clan : "clan-2",
                mercenaries : startMercenary
            },            {
                position : [dist,0],
                type : "capital",
                clan : "clan-3",
                mercenaries : startMercenary
            },            {
                position : [0,dist],
                type : "capital",
                clan : "clan-4",
                mercenaries : startMercenary
            }
        ];

        insertBuildingsDatas(capitales);


    }
    static getBuildingsOnArray( array : {x : number, y : number}[], callback : (buildings : BuildingI[])=>void ){

        findBuildingsOnPositions(array, buildings => {
            callback(buildings);
        });

    };


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