import { BuildingI } from "../interfaces/building.interface";
import { CaseI } from "../interfaces/case.interface";
import { CharaI } from "../interfaces/chara.interface";
import { MonsterI } from "../interfaces/monster.interface";
import { UserI } from "../interfaces/user.interface";

declare global {
   namespace Express {
      export interface Request {
         user?: UserI,
         worldCase?: (CaseI | CharaI | MonsterI | BuildingI)[]
      }
   }
}
