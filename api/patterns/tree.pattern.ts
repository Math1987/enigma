import { TreeI } from "./../interfaces/building.interface";
import { findBuildingsQuery, insertBuildingsDatas, updateBuildingById } from "./../queries/building.queries";
import { findRandomPlaceOn, findWorld } from "./../queries/world.queries";
import { BuildingPattern } from "./building.pattern";
import { WorldPattern } from "./world.pattern";

export class TreePattern extends BuildingPattern {

    static TREE_RATIO = {
        desert : 0.0125 
    }

    static pass(){

        console.log('pass trees');

        findBuildingsQuery({type : "tree"}).then( cursorTrees => {

            cursorTrees.forEach( building  => {
                
                let tree = building as TreeI ;
                let datas = { life : Math.min(tree.life + 10, 100)} ;
                updateBuildingById(tree._id, datas);

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

        const trees = [] ;
        arr.forEach( cc => {
            
            if (cc.type === "desert" && Math.random() <= this.TREE_RATIO.desert ){

                trees.push({
                    position : cc.position,
                    life : 100,
                    type : "tree"
                });

            }


        });
        if ( trees.length > 0 ){
            insertBuildingsDatas(trees).then( insertRes => {
                callback(insertRes.ops);
            });
        }else{
            callback([]); 
        }

    }
    static createTree(position : [number, number], life: number):void {

        const trees : TreeI[] = [{

            position : position,
            type : "tree",
            life : life

        }]

        insertBuildingsDatas( trees);

        console.log('create tree', trees[0]);

    }



    build(obj = null){
        const patt = new TreePattern(obj);
        return patt ;
    }


}