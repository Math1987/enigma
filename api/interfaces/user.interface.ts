import { CharaI } from "./chara.interface";

export interface UserI {
    email : string ;
    password? : string ;
    name : string ;
    chara : CharaI ;
}