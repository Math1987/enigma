export type Race = "human" | "dwarf" | "elf" | "vampire" ;

export interface CharaI {

    _id : string;
    type : "chara";
    name : string;
    img : string ;
    sexe : string; 
    race : string ;
    religion : string ;
    level : number ;
    clan : string ;
    
    position : [number,number];
    x : number ;
    y : number ;

    life : number ;
    lifeMax : number ;
    moves : number ;
    actions : number ;
    xp : number ;
    water : number ;
    food : number ;
    wood : number ;
    gold : number ;
    faith : number ;

    defense : number ;
    attack : number ;
    hunter : number ;
    dowser : number ;

    messages : string[] ;
}