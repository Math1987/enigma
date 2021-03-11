import { TreeI } from "./../interfaces/building.interface";
import { deleteBuildingData } from "../queries/solid.queries";
import { deleteOnWorld, findRandomPlaceOn, findWorld, incWorldValues, insertOnWorld, updateWorldValues } from "./../queries/world.queries";
import { updateSocketsValues } from "./base.pattern";
import { BuildingPattern } from "./building.pattern";
import { WorldPattern } from "./world.pattern";

export class TreePattern extends BuildingPattern {

    static TREE_RATIO = {
        desert : 0.0125 
    }

    static pass(){

        console.log('pass trees');

        findWorld({ solid : true, type : "tree"}).then( cursorTrees => {

            cursorTrees.forEach( building  => {
                
                let tree = building as TreeI ;
                let datas = { life : Math.min(tree.life + 10, 100)} ;
                updateWorldValues(tree._id, datas);

            });

            cursorTrees.count().then(numberOfActualTrees => {

                findWorld({ type : "desert" }).then( cursor => {

                    cursor.count().then( number => {
            
                        const numberOfTrees = Math.max(
                            0,
                            Math.ceil(number*TreePattern.TREE_RATIO.desert)-numberOfActualTrees
                            );

                            console.log('try generate ' + numberOfTrees + ' trees');
        
                        for ( let i = 0 ; i < numberOfTrees ; i ++ ){
                            findRandomPlaceOn({ type : "desert"}).then( randomPlace => {
                                randomPlace.forEach( world => {
                                   TreePattern.createTree(world.position,100);
                                });
                            });
                        }
                    });
                });
            });
        });

    }
    static test(){
        console.log('test tree patern')
    }
    static createRandomTreesOnArray( arr, callback : (trees : TreeI[]) =>void ){

        const trees : TreeI[] = [] ;
        arr.forEach( cc => {
            
            if (cc.name === "desert" && Math.random() <= this.TREE_RATIO.desert ){

                trees.push({
                    solid : true,
                    position : cc.position,
                    life : 100,
                    type : "tree",
                    name : "tree"
                });

            }


        });
        if ( trees.length > 0 ){
            insertOnWorld(trees).then( insertRes => {
                callback(insertRes.ops);
            });
        }else{
            callback([]); 
        }

    }
    static createTree(position : [number, number], life: number):void {

        const trees : TreeI[] = [{

            solid : true,
            position : position,
            type : "tree",
            name : "tree",
            life : life

        }]

        insertOnWorld( trees);

        console.log('create tree', trees[0]);

    }



    build(obj = null){
        const patt = new TreePattern(obj);
        return patt ;
    }
    incrementValues(values, callback:CallableFunction ){

        incWorldValues( this.obj._id, values).then( res => {
            if ( res.ok ){
                if ( res.value['life'] <= 0 ){
                    this.die( res => {

                    });
                }else{
                    console.log('socket update tree take',{x:this.obj.position[0],y:this.obj.position[1]}, this.obj._id)
                    updateSocketsValues({x:this.obj.position[0],y:this.obj.position[1]}, [{
                        _id : this.obj._id,
                        life : res.value['life']
                    }]);
                }
                callback(res.value);
            }else{
                callback(null);
            }
        }).catch( err => callback(null));

    }
    die(callback){
        deleteOnWorld(this.obj._id).then( () => {
            super.die(callback);
        });

    }

}