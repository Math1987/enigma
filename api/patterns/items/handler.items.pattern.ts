import { AdderI, ItemI, ItemTeaI } from "api/interfaces/item.interface"

const TEA : AdderI = {
    type : "adder",
    name : "tea",
    consumes : "water",
    consumeValue : 5,
    add : "actions",
    addValue : 1,
    number : 1,
    max : 10,
    randomNumberGen : 4,
    chanceGen : 0.33
}
const SPICE : AdderI = {
    type : "adder",
    name : "spice",
    consumes : "food",
    consumeValue : 5,
    add : "actions",
    addValue : 1,
    number : 1,
    max : 10,
    randomNumberGen : 2,
    chanceGen : 0.33
}

const LIFEPOTION : AdderI = {
    type : "adder",
    name : "lifePotion",
    consumes : "water",
    consumeValue : 0,
    add : "life",
    addValue : 10,
    number : 1,
    max : 3,
    randomNumberGen : 1,
    chanceGen : 0.1

}

export const ITEMS = {
    adders : {
        tea : TEA,
        spice : SPICE,
        lifePotion : LIFEPOTION
    }
}


export const createItem = ( type: "adders", name : string ) => {
    return ITEMS[type][name];
}
export const getRandomItemAdder = (type: "adders") => {
    const randomProperty = (obj) => {
        const keys = Object.keys(obj);
        return obj[keys[ keys.length * Math.random() << 0]];
    };

    let found = null ;
    while ( !found ){
        let test = randomProperty(ITEMS[type]);
        if ( Math.random() <= test.chanceGen ){
            found = test;
        }
    }

    found.number = Math.max(1, Math.floor(found.randomNumberGen*Math.random()));

    return found ;
}