
import { Pattern } from "./base.pattern";
import { BuildingI, CapitalI } from "./../interfaces/building.interface";
import { findBuildingsOnPositions, incBuildingValuesData, insertBuildingsDatas } from "./../queries/building.queries";
import { BuildingPattern } from "./building.pattern";
import { CharaPattern } from "./chara.patterns";

export class CapitalPattern extends BuildingPattern {

    build(obj = null){
        const patt = new CapitalPattern(obj);
        return patt ;
    }

    upgreatBuilding(value: number, callback : (capital:BuildingI)=>void ){

        const adder = Math.min(value,50 - this.obj.mercenariesMax );

        incBuildingValuesData(this.obj._id,{
            mercenariesMax : adder
        }).then(capital => {
            callback( capital.value );
        });

    }

    plunder(attacker : CharaPattern, callback){

        console.log(this.obj);

        let res = {} ;
        if ( this.obj.mercenariesMax > 10 ){
            incBuildingValuesData(this.obj._id, {mercenariesMax: -1}).then( capitalRes => {
                callback({
                    gold : Math.ceil(Math.random()*9),
                    mercenariesMax : capitalRes.value['mercenariesMax']
                });
            });

        }else{
            if ( Math.random() <= 0.5 ){
                res['gold'] = Math.ceil(Math.random()*5);
            }
            callback(res);
        }


    }

}