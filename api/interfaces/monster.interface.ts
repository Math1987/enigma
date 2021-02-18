
/**
 * Chara Interface:
 * 
 * Describe a chara used by players only.
 * All the fields on top are necessary whatever the situation, 
 * they can be shared as public on frontend.
 * All the values on bottom are optionnal and can be sent privatly only to concerned players.
 */
export interface MonsterI {

    name : string;
    type : "monster";
    life : number,
    lifeMax : number,
    position : [number,number],
    x : number,
    y : number,

}