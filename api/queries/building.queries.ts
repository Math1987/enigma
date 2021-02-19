import { FindAndModifyWriteOpResultObject, InsertWriteOpResult } from "mongodb";
import { BuildingI } from "../interfaces/building.interface";
import { convertId, database } from "./../data/index.data";
import { fixObjDatas } from "../patterns/base.pattern";



export async function insertBuildingsDatas( buildings : BuildingI[] ):Promise<InsertWriteOpResult<any>>{
    const collection = database.collection('buildings');
    return await collection.insertMany( buildings );
}

export async function findBuildingOnPosition( position : [number, number] ):Promise<BuildingI>{
    const collection = database.collection('buildings');
    return await collection.findOne( { 
        "position" : position
    } );
}


export async function findBuildingFromID(id : any ): Promise<BuildingI>{
    const collection = database.collection('buildings');
    return await collection.findOne({
        _id : convertId(id)
    });
}

export async function incBuildingValuesData( _id : string, datas ):Promise<FindAndModifyWriteOpResultObject<BuildingI>>{
    const cbuilding = database.collection('buildings');
    const req = {
        $inc : {}
    };
    for ( let key of Object.keys(datas) ){
        req.$inc[key] = datas[key] ;
    }
    return await cbuilding.findOneAndUpdate({
        _id : convertId(_id)
    }, req, { returnOriginal : false} ) ;
}

export const findBuildingsOnPositions = ( positions : {x:number,y:number}[], callback : (buildings : BuildingI[])=>void ): void => {
    
    const arr = positions.map( row => [row.x,row.y]);
    const buildings = [] ;
    const search = () => {
        if ( arr.length > 0 ){
            findBuildingOnPosition( arr[0] ).then( (res) => {
                if ( res ){
                    buildings.push(fixObjDatas(res));
                }
                arr.splice(0,1);
                search();
            }).catch( err => {
                arr.splice(0,1);
                search();
            });
        }else{
            callback(buildings);
        }
    };
    search();
}