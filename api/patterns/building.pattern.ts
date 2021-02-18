
import { Pattern } from "./base.pattern";
import { BuildingI, CapitalI } from "./../interfaces/building.interface";
import { findBuildingsOnPositions, insertBuildingsDatas } from "./../queries/building.queries";

export class BuildingPattern extends Pattern {

    static init(){

        const startMercenary = 30 ;
        const dist = 40 ;

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
            console.log(buildings);
            callback(buildings);
        });


    };

}