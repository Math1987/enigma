


const METADATAS = {

    search : {
        desert : {
            random : 0.1,
            items : [
                {
                    name : "lifePotion", 
                    random : 0.6,
                },
                {
                    name : "bigLifePotion",
                    random : 0.2
                },
                {
                    name : "teleportCapital",
                    random : 0.2
                }

            ]          
        },
        tree : {
            random : 0.4,
            items : [
                {
                    name : "spice",
                    random : 0.4
                },
                {
                    name : "tea",
                    random : 0.4
                },
                {
                    name : "lifePotion",
                    random : 0.1
                },
                {
                    name : "bigLifePotion",
                    random : 0.05
                },
                {
                    name : "teleportCapital",
                    random : 0.05
                }
            ]
        }
    }

}


export const getMetadatas = (callback) => {
    callback(METADATAS);
}