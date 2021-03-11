import { CharaI } from "../interfaces/chara.interface";
import { query } from "express";
import { Cursor, DeleteWriteOpResultObject, FindAndModifyWriteOpResultObject, InsertWriteOpResult } from "mongodb";
import { WorldI } from "../interfaces/world.interface";
import { database, convertId } from "./../data/index.data";
import { BuildingI } from "api/interfaces/building.interface";

const getCollection = () => {
    return database.collection('world');
}

export async function insertOnWorld( array : (WorldI|BuildingI|CharaI)[]):Promise<InsertWriteOpResult<any>>{
    const collection = database.collection('world');
    console.log('insering world', array);
    return await collection.insertMany(array);
}
export const createOnWorld = function( datas, callback: (chara:CharaI | WorldI | BuildingI) => void ):void{
    const ccharas = getCollection();
    ccharas.insertOne(datas, (err, res) => {
        if (err){
            callback(null);
        }else {
            callback(res.ops[0]);
        }
    }) ;
}



export async function findWorld(query?: any):Promise<Cursor<WorldI | CharaI | BuildingI>>{
    const collection = database.collection('world');
    return await collection.find(query);
}
export async function findOneOnWorld(query?: any):Promise<Cursor<WorldI | CharaI | BuildingI >>{
    const collection = database.collection('world');
    return await collection.findOne(query);
}
export async function findWorldByID( _id:any ):Promise<WorldI | CharaI>{
    const collection = getCollection();
    return await collection.findOne({ 
        _id : convertId(_id)
    });
}
export async function findWorldNear( query : any, x: number, y : number, rayon : number ):Promise<Cursor<CharaI>>{
    const collection = getCollection();
    return await collection.find({
        ...query,
        x : { $lte : (x+rayon), $gte : (x-rayon) },
        y : { $lte : (y+rayon), $gte : (y-rayon) }
    });
}
export async function findWorldOnPosition( query : any, x : number, y : number, callback):Promise<Cursor<CharaI>>{
 
    const collection = getCollection();
    return await collection.find({
        position : [x,y]
        }, callback );

}
export const findWorldInPositions = ( query : any, array : {x : number, y : number}[], callback: (charas: (CharaI|WorldI|BuildingI)[])=>void ) => {
    

    const charas = [] ;
    if ( array.length > 0 ){

        const arrP = array.map(row=> [row.x,row.y]);

        findWorld({
            ...query,
            position : { $in : arrP }
        }).then( cursor => {

            cursor.toArray().then( resCharas => {
                for ( let chara of resCharas ){
                    charas.push(chara);
                }

                callback(charas);
            }).catch( err => {
                console.log(err);
                callback([]);
    
            });
            
        }).catch( err => {
            callback([]);
        });
    }
}
export async function findSolidOnPosition( position : [number, number] ):Promise<BuildingI>{
    const collection = getCollection();
    return await collection.findOne( { 
        "position" : position, 
        solid : true
    } );
}
/**
 * FindRandomPlaceOn
 * Give a random position of the world explored
 * 
 * @param query The type of boxes in which you want a position
 * (for exemple {type: "desert"}, or {type:"deepdesert"})
 */
 export async function findRandomPlaceOn(query):Promise<Cursor<WorldI>>{
    const collection = database.collection('world');
    const number = await collection.find(query).count() ;
    return await collection.find(query).limit(1).skip( Math.floor(Math.random()*number));
}


export async function incWorldValues( _id : string, datas ):Promise<FindAndModifyWriteOpResultObject<WorldI | CharaI>>{
    const ccharas = getCollection();
    const filter = {
        _id : convertId(_id)
    }
    const req = {
        $inc : {}
    };
    for ( let key of Object.keys(datas) ){
        req.$inc[key] = datas[key] ;
    }
    return await ccharas.findOneAndUpdate(filter, req, { returnOriginal : false} ) ;
}
export async function updateWorldValues(_id : string, datas ):Promise<FindAndModifyWriteOpResultObject<WorldI | BuildingI | CharaI>>{
    const ccharas = getCollection();
    const filter = {
        _id : convertId(_id)
    }
    const req = {
        $set : {}
    };
    for ( let key of Object.keys(datas) ){
        req.$set[key] = datas[key] ;
    }
    return await ccharas.findOneAndUpdate(filter, req, { returnOriginal : false}) ;
}
export async function findOneAndUpdateWorldById( _id : any,  query : any, ops = {} ):Promise<FindAndModifyWriteOpResultObject<CharaI>>{
    const collection = getCollection();
    return await collection.findOneAndUpdate({
        _id : convertId(_id)
        }, query, 
        {...ops, returnOriginal : false});
}

export async function updateWorldPosition( _id : string, x : number, y : number ):Promise<FindAndModifyWriteOpResultObject<CharaI>>{

    const ccharas = getCollection();
    const filter = {
        _id : convertId(_id)
    }
    return await ccharas.findOneAndUpdate(filter, {
        $set : { position : [x,y]}
    }, { returnOriginal : false }) ;

}
export async function addItemOnWorldInventory( _id : any,  item):Promise<FindAndModifyWriteOpResultObject<CharaI>>{
    const collection = getCollection();
    return await collection.findOneAndUpdate({
        _id : convertId(_id)
        }, {
            $push : {
                inventory : {
                    $each : [item],
                    $slice : 6
                }
            }
        }, 
        { returnOriginal : false});
}



export const destroyWorldItem = (_id, item, callback) => {
    const req = {
        $pull : {
            inventory : {
                name : item.name
            }
        }
    };
    findOneAndUpdateWorldById(_id, req ).then( callback);
}
export async function deleteOnWorld( _id : any) : Promise<DeleteWriteOpResultObject> {
    
    const collection = getCollection();
    return await collection.deleteOne({ 
        _id : convertId(_id)
    });

}