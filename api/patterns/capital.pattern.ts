
import { Pattern } from "./base.pattern";
import { BuildingI, CapitalI } from "./../interfaces/building.interface";
import { findBuildingsOnPositions, insertBuildingsDatas } from "./../queries/building.queries";
import { BuildingPattern } from "./building.pattern";

export class CapitalPattern extends BuildingPattern {

    build(obj = null){
        const patt = new CapitalPattern(obj);
        return patt ;
    }

}