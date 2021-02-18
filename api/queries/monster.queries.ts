import { Cursor, DeleteWriteOpResultObject, FindAndModifyWriteOpResultObject, InsertWriteOpResult } from "mongodb";
import { database, convertId } from "../data/index.data";
import { MonsterI } from "../interfaces/monster.interface";

/**
 * this function does not use mongodb directly
 * It call a cycle of functions using mongodb
 * (not good pratice need to work on it)
 */
export const findMonstersOnArrays = ( array : {x : number, y : number}[], callback:(monsters:MonsterI[])=>void ) => {
    
    const arr = [...array];
    const monsters = [] ;
    const search = () => {
        if ( arr.length > 0 ){
            findMonstersOnPosition(arr[0].x, arr[0].y, (err, resMonsters ) => {
                if ( err ){
                    console.log(err);
                }else if ( resMonsters ){
                    resMonsters.toArray().then( resMonster2 => {
                        for ( let monster of resMonster2 ){
                            monsters.push(monster);
                        }
                        arr.splice(0,1);
                        search();
                    }).catch( err => {
                        console.log(err);
                        arr.splice(0,1);
                        search();
                    });
                }
            });
        }else{
            callback(monsters);
        }
    };
    search();

}
export async function findMonstersOnPosition(x:number, y:number, callback):Promise<Cursor<MonsterI>>{

    const collection = database.collection('monsters');
    return await collection.find({
        position : [x,y]
        }, callback );

}
export async function findMonsterByID(_id):Promise<MonsterI> {

    const collection = database.collection('monsters');
    return await collection.findOne({ 
        _id : convertId(_id)
    });
}
export async function findMonstersCursor(query?:any):Promise<Cursor<MonsterI>>{
    const collection = database.collection('monsters');
    return await collection.find(query);
}
export async function insertMonsters( monsters ):Promise<InsertWriteOpResult<any>>{
    const collection = database.collection('monsters');
    return await collection.insertMany(monsters);
}
export async function incMonsterValuesData( _id : string, datas ):Promise<FindAndModifyWriteOpResultObject<MonsterI>>{

    const ccharas = database.collection('monsters');
    const filter = {
        _id : convertId(_id)
    }
    const req = {
        $inc : {}
    };
    for ( let key of Object.keys(datas) ){
        req.$inc[key] = datas[key] ;
    }

    return await ccharas.findOneAndUpdate(filter, req, { returnOriginal : false}) ;

}
export async function updateMonsterPositionDatas(_id, x, y):Promise<FindAndModifyWriteOpResultObject<MonsterI>>{

    const ccharas = database.collection('monsters');
    const filter = {
        _id : convertId(_id)
    }
    return await ccharas.findOneAndUpdate(filter, {
        
        $set : { position : [x,y]}

    }, { returnOriginal : false}) ;

}
export async function deleteMonsterData( _id : any) : Promise<DeleteWriteOpResultObject> {
    
    const collection = database.collection('monsters');
    return await collection.deleteOne({ 
        _id : convertId(_id)
    });

}