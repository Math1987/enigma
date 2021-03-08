import { Cursor, FindAndModifyWriteOpResultObject, ObjectId } from "mongodb";
import { CharaI } from "../interfaces/chara.interface";
import { convertCharaForFrontend } from "../patterns/chara.patterns";
import { database, convertId } from "./../data/index.data";

const getCollection = () => {
    return database.collection('world') ;
}

export async function findCharaDatasByUserID( _id:any ):Promise<CharaI>{
    const collection = getCollection();
    return await collection.findOne({ 
        user : convertId(_id)
    }) ;
}
export async function findSortedCharasCursor( query ):Promise<Cursor<CharaI>>{
    const collection = getCollection();
    return await collection.find({type : "chara"}).sort(query) ;
}
export async function addMessageOnChara( _id : any,  message):Promise<FindAndModifyWriteOpResultObject<CharaI>>{
    const collection = getCollection();
    return await collection.findOneAndUpdate({
        _id : convertId(_id)
        }, {
            $push : {
                messages : {
                    $each : [message],
                    $position : 0,
                    $slice : 20
                }
            }
        }, 
        { returnOriginal : false});
}
export async function addItemOnCharaInventory( _id : any,  item):Promise<FindAndModifyWriteOpResultObject<CharaI>>{
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
// export async function queryCharaFindOneAndUpdateById( _id : any,  query : any, ops = {} ):Promise<FindAndModifyWriteOpResultObject<CharaI>>{
//     const collection = getCollection();
//     return await collection.findOneAndUpdate({
//         _id : convertId(_id)
//         }, query, 
//         {...ops, returnOriginal : false});
// }


// export async function findCharaOnPosition( pos : {x : number, y : number}, callback):Promise<Cursor<CharaI>>{
 
//     const collection = getCollection();
//     return await collection.find({
//         position : [pos.x,pos.y]
//         }, callback );

// }
// export async function findCharaDatasByID( _id:any ):Promise<CharaI>{
//     const collection = getCollection();
//     return await collection.findOne({ 
//         _id : convertId(_id)
//     });
// }
// export async function findCharasNear( x: number, y : number, rayon : number ):Promise<Cursor<CharaI>>{
//     const collection = getCollection();
//     return await collection.find({
//         x : { $lte : (x+rayon), $gte : (x-rayon) },
//         y : { $lte : (y+rayon), $gte : (y-rayon) }
//     });
// }
// export const createCharaDatas = function( datas, callback: (chara:CharaI)=>void ):void{
//     const ccharas = getCollection();
//     ccharas.insertOne(datas, (err, res) => {
//         if (err){
//             console.log(err) ;
//             callback(null);
//         }else {
//             callback(res.ops[0]);
//         }
//     }) ;
// }
// export async function incCharaValuesData( _id : string, datas ):Promise<FindAndModifyWriteOpResultObject<CharaI>>{
//     const ccharas = getCollection();
//     const filter = {
//         _id : convertId(_id)
//     }
//     const req = {
//         $inc : {}
//     };
//     for ( let key of Object.keys(datas) ){
//         req.$inc[key] = datas[key] ;
//     }
//     return await ccharas.findOneAndUpdate(filter, req, { returnOriginal : false} ) ;
// }
// export async function updateCharaValuesData(_id : string, datas ):Promise<FindAndModifyWriteOpResultObject<CharaI>>{
//     const ccharas = getCollection();
//     const filter = {
//         _id : convertId(_id)
//     }
//     const req = {
//         $set : {}
//     };
//     for ( let key of Object.keys(datas) ){
//         req.$set[key] = datas[key] ;
//     }
//     return await ccharas.findOneAndUpdate(filter, req, { returnOriginal : false}) ;

// }
// export async function updateCharaPositionDatas( _id : string, x : number, y : number ):Promise<FindAndModifyWriteOpResultObject<CharaI>>{

//     const ccharas = getCollection();
//     const filter = {
//         _id : convertId(_id)
//     }
//     return await ccharas.findOneAndUpdate(filter, {
        
//         $set : { position : [x,y]}

//     }, { returnOriginal : false }) ;

// }
// export async function findCharasCursor(query = {}, projection = {}):Promise<Cursor<CharaI>>{
//     const collection = getCollection();
//     return await collection.find(query, {projection : projection});
// }


/**
 * this function does not use mongodb directly
 * It call a cycle of functions using mongodb
 * (not good pratice need to work on it)
 */
// export const findCharasOnPositions = ( array : {x : number, y : number}[], callback: (charas:CharaI[])=>void ) => {

//     const arr = [...array];
//     const charas = [] ;
//     const search = () => {
//         if ( arr.length > 0 ){
//             findCharaOnPosition(arr[0], (err, resCharas ) => {
//                 if ( err ){
//                     console.log(err);
//                 }else if ( resCharas ){
//                     resCharas.toArray().then( resCharas => {
//                         for ( let chara of resCharas ){
//                             charas.push(chara);
//                         }
//                         arr.splice(0,1);
//                         search();
//                     }).catch( err => {
//                         console.log(err);
//                         arr.splice(0,1);
//                         search();
//                     });
//                 }
//             });
//         }else{
//             callback(charas);
//         }
//     };
//     search();
// }


// export const readCharaByUserId = ( id_ : string, callback : (chara:CharaI)=>void ):void => {

//     findCharaDatasByUserID( id_).then( charaRes => {
//         if ( charaRes ){
//             callback( convertCharaForFrontend(charaRes) );
//         }else{
//             callback(null);
//         }
//     });

// }
