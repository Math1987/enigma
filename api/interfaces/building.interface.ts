export interface BuildingI {

    _id? : string ;
    position : [number, number];
    type : string;

}

export interface CapitalI {

    _id? : string ;
    position : [number, number];
    type : "capital";
    clan : string ;
    mercenaries : number ;

}

export interface TreeI {

    _id? : string ;
    position : [number, number];
    type : "tree";
    life : number ;
    ownerID? : string ;

}