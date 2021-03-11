export interface BuildingI {

    _id? : string ;
    solid : true ;
    position : [number, number];
    type : string;

}

export interface CapitalI {

    _id? : string ;
    solid : true ;
    position : [number, number];
    type : "capital";
    clan : string ;
    mercenaries : number ;
    mercenariesMax? : number ;


}

export interface TreeI {

    _id? : string ;
    solid : true ;
    position : [number, number];
    type : "tree";
    name : string ;
    life : number ;
    ownerID? : string ;

}