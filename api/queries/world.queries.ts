import { Cursor, InsertWriteOpResult } from "mongodb";
import { WorldI } from "../interfaces/world.interface";
import { database, convertId } from "./../data/index.data";


export async function insertOnWorld( array : WorldI[]):Promise<InsertWriteOpResult<any>>{
    const collection = database.collection('world');
    return await collection.insertMany(array);
}
export async function findWorld(query?: any):Promise<Cursor<WorldI>>{
    const collection = database.collection('world');
    return await collection.find(query);
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
