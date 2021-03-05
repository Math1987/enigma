import { ItemI } from "./item.interface";

/**
 * Chara Interface:
 * 
 * Describe a chara used by players only.
 * All the fields on top are necessary whatever the situation, 
 * they can be shared as public on frontend.
 * All the values on bottom are optionnal and can be sent privatly only to concerned players.
 */
export interface CharaI {

    _id : string;
    name : string;
    type : "chara";
    sexe : string;
    race : string;
    religion : string;
    clan : string;
    level : number;
    life : number;
    lifeMax : number;
    position : [number,number];
    x : number;
    y : number;
    img? : string;


    moves? : number;
    actions? : number;
    searches? : number ;


    xp? : number;
    water? : number;
    waterMax? : number;
    food? : number;
    foodMax? : number;
    wood? : number;
    woodMax? : number;
    faith? : number;
    faithMax? : number;
    gold : number ;
    defense? : number;
    attack? : number;
    hunter? : number;
    dowser? : number;
    lumberjack? : number;
    priest? : number;
    state? : string ;
    kills? : number ;

    inventory? : ItemI[] ;
    messages? : string[];
}