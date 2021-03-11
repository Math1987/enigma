
import { Pattern } from "./base.pattern";
import { BuildingI, CapitalI } from "./../interfaces/building.interface";
import { CharaPattern } from "./chara.patterns";
import { BuildingPattern } from "./building.pattern";
import { findOneOnWorld, incWorldValues, insertOnWorld } from "../queries/world.queries";

console.log('init capital PATTERN');


export class CapitalPattern extends BuildingPattern {

    static init(){

        const startMercenary = 20 ;
        const merceneriesMax = 20 ;
        const dist = 20 ;

        const createCapitals = () => {
            const capitales : CapitalI[] = [
                {
                    solid : true,
                    position : [-dist,0],
                    type : "capital",
                    clan : "clan-1",
                    mercenaries : startMercenary,
                    mercenariesMax : merceneriesMax
                },
                {
                    solid : true,
                    position : [0,-dist],
                    type : "capital",
                    clan : "clan-2",
                    mercenaries : startMercenary,
                    mercenariesMax : merceneriesMax
                },
                {
                    solid : true,
                    position : [dist,0],
                    type : "capital",
                    clan : "clan-3",
                    mercenaries : startMercenary,
                    mercenariesMax : merceneriesMax
                },
                {
                    solid : true,
                    position : [0,dist],
                    type : "capital",
                    clan : "clan-4",
                    mercenaries : startMercenary,
                    mercenariesMax : merceneriesMax
                }
            ];
    
            insertOnWorld(capitales);
        }
        findOneOnWorld({solid:true,type:"capital"}).then( capitals => {
            if ( !capitals ){
                createCapitals();
            }
        });

    }

    build(obj = null){
        const patt = new CapitalPattern(obj);
        return patt ;
    }

    upgreatBuilding(value: number, callback : (capital:BuildingI)=>void ){

        const adder = Math.min(value,50 - this.obj.mercenariesMax );

        incWorldValues(this.obj._id,{
            mercenariesMax : adder
        }).then(capital => {
            callback( capital.value );
        });

    }

    plunder(attacker : CharaPattern, callback){

        console.log(this.obj);

        let res = {} ;
        if ( this.obj.mercenariesMax > 10 ){
            incWorldValues(this.obj._id, {mercenariesMax: -1}).then( capitalRes => {
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