import { AdderI, ItemI, ItemTeaI } from "api/interfaces/item.interface"

const TEA : AdderI = {
    type : "adder",
    name : "tea",
    consumes : "water",
    consumeValue : 5,
    add : "actions",
    addValue : 1

}

export const ITEMS = {
    tea : TEA
}


export const createItem = ( name : string ) => {

    return ITEMS[name];

}