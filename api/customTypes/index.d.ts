import { BuildingI } from "api/interfaces/building.interface";
import { CaseI } from "api/interfaces/case.interface";
import { CharaI } from "api/interfaces/chara.interface";
import { MonsterI } from "api/interfaces/monster.interface";
import { UserI } from "../interfaces/user.interface";

declare global {
   namespace Express {
      export interface Request {
         user?: UserI,
         worldCase?: (CaseI | CharaI | MonsterI | BuildingI)[]
      }
   }
}
