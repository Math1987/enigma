export interface ItemI {

    type : string ;
    name : string ;

}

export interface AdderI {

    type : "adder" ;
    name : string ;
    consumes : string ;
    consumeValue : number,
    add : string,
    addValue : number

}