import { CharaI } from "./chara.interface";

export interface UserI {

    _id : string ;
    name : string ;
    img : string ;
    token : string ; 

    chara : CharaI | null ;

}