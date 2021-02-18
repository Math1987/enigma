export interface DrawWaterI {
    base : number ; 
    defense : number;
    defense_log : number;
    desert : number;
    neutral : number;
    well : number ;
};
export interface HuntI {
    base : number ; 
    defense : number;
    defense_log : number;
    desert : number;
    neutral : number;
    well : number ;
};
export interface LumberjackI {
    base : number ; 
    defense : number;
    defense_log : number;
    desert : number;
    neutral : number;
    well : number ;
};
export interface PrayI {
    base : number ; 
    defense : number;
    defense_log : number;
    desert : number;
    neutral : number;
    well : number ;
};
export interface AttackI {
    proba_min : number;
    proba_min_hunt: number;
    proba_hunt : number;
    proba_factor1 : number;
    proba_min_faith : number;
    proba_faith : number;
    proba_factor2 : number;

    lumberjack_min: number;
    lumberjack : number;
    dowser_min :number ;
    dowser : number;
    factor : number ;
}
export interface CalculsI {
    drawWater : DrawWaterI,
    hunt : HuntI,
    lumberjack : LumberjackI,
    pray : PrayI,
    attack : AttackI ;
}