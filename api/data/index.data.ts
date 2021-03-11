/** 
 * INDEX DATA
 * 
 * All mongoDB direct usage.
 * provide functions (most async).
 * 
 */

import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import { Environment } from "../environment/environment";


const client = new MongoClient('mongodb://localhost',{ useUnifiedTopology: true } );
export let database : Db ;

export let worldCollection : Collection<any> = null ;


export const initMongoDB = (callback: (res)=>void) => {

    client.connect().then( co => {


        database = client.db(Environment.mongodb.name);

        //updateDatasSystem1_FUSION_WORLD_CHARAS(database);

        //updateDatasSystem2_FUSION_WORLD_BUILDINGS(database);



        const cusers = database.collection('users');
        cusers.createIndex({"email":1}, {unique : true});
    
        /**
         * World managment in db: world is created dynamically when users discovering new areas 
         * This is wy we create here an index on position as unique to be sure
         * than all positions will be uniques. 
         * Each time a user get some part of the word (when he see map and move), 
         * he potentialy add new positions
         */
        const world = database.collection('world');
        // world.createIndexes([{key : {"position.0" : 1, "position.1":1}, unique : true} ]);
        // world.createIndex(
        //     {
        //         key : {"position.0" : 1, "position.1":1}, {
        //         unique : true,
        //         partialFilterExpression: { name : { $eq : ""}}   
        //     });
        worldCollection = world ;
    
        const buildings = database.collection('buildings');
        // buildings.createIndexes([{key : {"position.0" : 1, "position.1":1}, unique : true} ]);
    
        const charas = database.collection('users');
        const monsters = database.collection('monsters');

        callback(true);

    });
}

const updateDataSystem = (database:Db) => {

    console.log('update Data System');
    const world = database.collection('world');

    world.indexes().then( indexes => {

        if ( indexes.reduce( 
            (acc, row) => {
                if (row.name === "position.0_1_position.1_1" && !row.partialFilterExpression ){
                    acc = true ;
                }
                return acc ;
            }
            , false ) ){
    
        }else{
            console.log('index world ok');
        }

    });

}
const updateDatasSystem1_FUSION_WORLD_CHARAS = ( database : Db) => {

    const world = database.collection('world');
    world.dropIndex("position.0_1_position.1_1").finally( ()=> {

        world.createIndex(
            {"position.0" : 1, "position.1":1}, {
            unique : true,
            partialFilterExpression: { type : { $eq : "floor"}}
            }   
        );
    });

    console.log("updating charas");
    const chara = database.collection('charas');
    
    const charas = chara.find({});
    charas.toArray().then( charaArray => {

        world.insertMany( charaArray );

    });
    // world.insertMany( )
}
const updateDatasSystem2_FUSION_WORLD_BUILDINGS = (database : Db) => {


    const world = database.collection('world');

    world.indexes().then( indexes => {

        let gotBuildingsOnWorld = indexes.reduce( (acc,row) =>  {
            if ( row.name === 'position.0_1_position.1_1_solid_1' ){
                acc = true ;
            }
            return acc ;

        }, false);

        console.log('got solid index:', gotBuildingsOnWorld );

        if ( !gotBuildingsOnWorld ){


            world.deleteMany({solid : true}).then( deletRes => {


                world.createIndex(
                    { 'position.0' : 1, 'position.1' : 1, 'solid' : 1}, {
                    unique : true,
                    partialFilterExpression : { solid : { $eq : true}}
                    }   
                ).then( createIndexRes => {  
                    
                    console.log('index create res', createIndexRes);
    
                    const buildings = database.collection('buildings');
                    const newBuildings = [] ;
                    buildings.find().forEach( building => {
        
                        let newBuilding = {...building};
                        newBuilding = {...newBuilding, solid : true, name : building.type };
                        newBuildings.push(newBuilding);
                        console.log(newBuilding);
        
                    }).then( endCheck => {
    
                        world.insertMany( newBuildings, insertRes => {
        
                        });
        
                    });
                });



            });



        }

    });

}

export const convertId = (_id:any):ObjectId => {
    let id = _id ;
    if ( !(id instanceof ObjectId)  ){
        id = ObjectId.createFromHexString(_id);
    }
    return id ;
}

export const queryOnWorld = (callback : (collection : Collection)=>void) => {
    callback(worldCollection);
}


// /**
//  * this function does not use mongodb directly
//  * It call a cycle of functions using mongodb
//  * (not good pratice need to work on it)
//  */
// export const findMonstersOnArrays = ( array : {x : number, y : number}[], callback:(monsters:MonsterI[])=>void ) => {
    
//     const arr = [...array];
//     const monsters = [] ;
//     const search = () => {
//         if ( arr.length > 0 ){
//             findMonstersOnPosition(arr[0].x, arr[0].y, (err, resMonsters ) => {
//                 if ( err ){
//                     console.log(err);
//                 }else if ( resMonsters ){
//                     resMonsters.toArray().then( resMonster2 => {
//                         for ( let monster of resMonster2 ){
//                             monsters.push(monster);
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
//             callback(monsters);
//         }
//     };
//     search();

// }
// export async function findMonstersOnPosition(x:number, y:number, callback):Promise<Cursor<MonsterI>>{

//     const collection = database.collection('monsters');
//     return await collection.find({
//         position : [x,y]
//         }, callback );

// }
// export async function findMonsterByID(_id):Promise<MonsterI> {

//     const collection = database.collection('monsters');
//     return await collection.findOne({ 
//         _id : convertId(_id)
//     });
// }
// export async function findMonstersCursor(query?:any):Promise<Cursor<MonsterI>>{
//     const collection = database.collection('monsters');
//     return await collection.find(query);
// }
// export async function insertMonsters( monsters ):Promise<InsertWriteOpResult<any>>{
//     const collection = database.collection('monsters');
//     return await collection.insertMany(monsters);
// }
// export async function incMonsterValuesData( _id : string, datas ):Promise<FindAndModifyWriteOpResultObject<MonsterI>>{

//     const ccharas = database.collection('monsters');
//     const filter = {
//         _id : convertId(_id)
//     }
//     const req = {
//         $inc : {}
//     };
//     for ( let key of Object.keys(datas) ){
//         req.$inc[key] = datas[key] ;
//     }

//     return await ccharas.findOneAndUpdate(filter, req, { returnOriginal : false}) ;

// }
// export async function updateMonsterPositionDatas(_id, x, y):Promise<FindAndModifyWriteOpResultObject<MonsterI>>{

//     const ccharas = database.collection('monsters');
//     const filter = {
//         _id : convertId(_id)
//     }
//     return await ccharas.findOneAndUpdate(filter, {
        
//         $set : { position : [x,y]}

//     }, { returnOriginal : false}) ;

// }
// export async function deleteMonsterData( _id : any) : Promise<DeleteWriteOpResultObject> {
    
//     const collection = database.collection('monsters');
//     return await collection.deleteOne({ 
//         _id : convertId(_id)
//     });

// }