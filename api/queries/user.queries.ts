import { UserI } from "../interfaces/user.interface";
import { convertCharaForFrontend } from "../patterns/chara.patterns";
import { findCharaDatasByUserID } from "./chara.queries";
import { database, convertId } from "./../data/index.data";



export function createUserDatas( datas : UserI, callback? :  (user : UserI) => void ):void{
    const collection = database.collection('users');
    collection.insertOne(datas, (err, res) => {
        if (err){
            console.log(err) ;
            callback(null);
        }else {
            callback(res.ops[0]);
        }
    });
}
export async function findUserDatasByEmail( email : string ):Promise<UserI>{
    const collection = database.collection('users');
    return await collection.findOne({email : email}) ;
}
export async function findUserDatasByID( _id:string, projection = { "password" : 0} ) : Promise<UserI> {
    const collection = database.collection('users');
    return await collection.findOne({ 
        _id : convertId(_id)
    }, { fields : projection } ) ;
}



/**
 * read User and add CharaUser if got one.
 */
export const readFullUserById = (_id : string, callback : (user:UserI)=>void ):void => {

    findUserDatasByID(_id ).then( user => {
        findCharaDatasByUserID( _id ).then( chara => {

            if ( chara ){

                user['chara'] = convertCharaForFrontend(chara) ;

                // findWorld({ solid : true, type : "capital", clan : chara['clan']}).then(capital => {

                //     if ( capital ){
                //         user['chara']['capital'] = capital ;
                //     }   
                    callback(user);

                // }).catch( err => {

                //     callback(user);

                // });


            }else{

                callback(user);

            }

        });
    });

}
