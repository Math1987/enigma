import { AdderI } from "../../interfaces/item.interface"

const TEA : AdderI = {
    type : "adder",
    name : "tea",
    consumes : "water",
    consumeValue : 5,
    add : "actions",
    addValue : 1,
    number : 1,
    max : 1,
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
    max : 1,
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
    max : 1,
    randomNumberGen : 1,
    chanceGen : 0.1

}
const BIGLIFEPOTION : AdderI = {
    type : "adder",
    name : "bigLifePotion",
    consumes : "water",
    consumeValue : 0,
    add : "life",
    addValue : 20,
    number : 1,
    max : 1,
    randomNumberGen : 1,
    chanceGen : 0.1

}

export const ITEMS = {
    adders : {
        tea : TEA,
        spice : SPICE,
        lifePotion : LIFEPOTION
    },
    tea : TEA,
    spice : SPICE,
    lifePotion : LIFEPOTION,
    bigLifePotion : BIGLIFEPOTION
}


export const createItem = ( type: "adders", name : string ) => {
    return ITEMS[type][name];
}
export const getRandomItemAdder = ( itemsMedatDatas ) => {

    console.log('search items on', itemsMedatDatas);

    let found = null ;
    while ( !found ){
        let randIndex = Math.floor(Math.random()*itemsMedatDatas.length);
        if ( Math.random() <= itemsMedatDatas[randIndex].random ){
            found = ITEMS[itemsMedatDatas[randIndex].name];
        }
    }

    found.number = 1 ;// Math.max(1, Math.floor(found.randomNumberGen*Math.random()));

    return found ;
}