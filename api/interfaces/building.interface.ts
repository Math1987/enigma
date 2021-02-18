export interface BuildingI {

    position : [number, number];
    type : string;

}

export interface CapitalI {

    position : [number, number];
    type : "capital";
    clan : string ;
    mercenaries : number ;

}