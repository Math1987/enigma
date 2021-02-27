/**
 * CHARA PATTERN
 * 
 * Handle all the charas behavior.
 * Chara are the user's objects.
 * Can be masculin, feminine, a human, dwarf, elf or vampire etc...
 * 
 */
import { 
    findCharasOnPositions, 
    findCharasNear, 
    incCharaValuesData,
    findCharaDatasByID,
    updateCharaPositionDatas,
    updateCharaValuesData,
    addMessageOnChara,
    findCharasCursor 
} from "../queries/chara.queries";
import { 
    buildInstanceFromId, 
    buildInstanceFromDatas,
    fixObjDatas,
    getCalculs,
    Pattern,
    socketsAdd,
    socketsResurrection,
    updateSocketsValues
} from "./base.pattern";
import { CapitalPattern } from "./capital.pattern";
import { WorldPattern } from "./world.pattern";
import { findBuildingOnPosition, incBuildingValuesData } from "./../queries/building.queries";
import { CharaI } from "api/interfaces/chara.interface";
import { BuildingPattern } from "./building.pattern";

export const getCharaPattern = ( chara : any, callback : CallableFunction) => {

    callback({
        name : chara.name,
        type : "chara",
        img : `/assets/images/${chara.race+chara.sexe}_illu.png`,
        position : [0,0],
        x : 0,
        y : 0,
        
        sexe : chara.sexe, 
        race : chara.race,
        religion : chara.religion,
        clan : chara.clan,
        level : 1,
        
        life : 100,
        lifeMax : 100,
        moves : 40,
        actions : 10,
        xp : 50,
        water : 10,
        waterMax : 40,
        food : 10,
        foodMax : 40,
        wood : 10,
        woodMax : 40,
        faith : 10,
        faithMax : 40,
        gold : 0,
        
        defense : 5,
        attack : 5,
        hunter : 5,
        dowser : 5,
        lumberjack : 5,
        priest : 5,
        
        messages :[],
        kills : 0
    });

}
export const convertCharaForFrontend = (chara) => {
    if ( chara ){
        chara['x'] = chara.position[0] ;
        chara['y'] = chara.position[1] ;
        chara['level'] = chara['level'].toFixed(1);
        chara['type'] = "chara" ;
    }
    return chara ;
}

export class CharaPattern extends Pattern{

    static getWorldCharasOnArray = (array : {x : number, y : number}[], callback : CallableFunction ) => {

        findCharasOnPositions(array, charas => {

            const final = charas.map( row => convertCharaForFrontend(row))

            callback(final);

        });

    }
    static getWorldCharasOn = ( x: number, y : number, rayon : number, callback : CallableFunction ) => {

        findCharasNear(x,y,rayon).then( cursorCharas => {

            cursorCharas.toArray().then( nxt => {

                callback(nxt);

            });

        }).catch( err => {
            callback([]);
        });

    }
    static isOnView = ( chara, x, y, rayon ) => {

        if ( chara.x >= x - rayon && chara.x <= x + rayon && 
            chara.y >= y - rayon && chara.y <= y + rayon ){

                return true ;

            }
            return false ;

    }
    static makeAction = ( action : string, charaFrom : Object, target : any, callback : CallableFunction  ) => {

        if ( target['_id'] ){
            CharaPattern.makeActionOnObjec(charaFrom, target['_id'], action, callback);
        }else if ( target['type'] === "floor" ) {
            CharaPattern.makeActionOnFloor(charaFrom, target, action, callback);
        }else{
            callback(null);
        }


    }
    static makeActionOnObjec(user, targetID, action, callback ){

        buildInstanceFromDatas( user, charaFromPattern => {
            buildInstanceFromId( targetID, targetPattern => {

                if ( charaFromPattern && targetPattern ){
                    charaFromPattern.makeAction(action, targetPattern, actRes => {
                        callback(actRes);
                    })

                }else{
                    callback(null);
                }
    
            });
        });
    }
    static makeActionOnFloor(user, target, action, callback){

        if ( target.name === "neutral" ){
            callback(null);
        }else {
            buildInstanceFromDatas( user, charaFromPattern => {

                if ( charaFromPattern ){
                    charaFromPattern.makeAction(action, target, actRes => {
                        callback(actRes);
                    });
                }else{
                    callback(null);
                }
            });
        }
    }
    static pass(){

        findCharasCursor().then( cursor => {
    
            cursor.forEach(element => {
    
                buildInstanceFromId(element['_id'], pattern => {
    
                    pattern.pass();
    
                });
    
            });
    
        });

    }

    constructor(args?){
        super(args);
    }
    build(obj = null){
        const patt = new CharaPattern(obj);
        return patt ;
    }
    pass(){
        getCharaPattern( {}, charaModel => {
           

            const end = (building) => {

                let autoDammages = 0 ;

                let waterUse = Math.min(this.obj.water, 5);
                let foodUse = Math.min(this.obj.food, 5);
    
                let message = `pass water -${waterUse}, food -${foodUse}`;
    
                if ( this.obj.food < 5 ){
                    autoDammages = Math.abs(this.obj.food - 5);
                }
                if ( this.obj.water < 5 ){
                    autoDammages += Math.abs(this.obj.water - 5 );
                }


                if ( building && building.type === "capital" && building.clan === this.obj.clan ){
                    autoDammages = 0 ;
                    waterUse = 0 ;
                    foodUse = 0 ;
                    this.obj.water = Math.min(this.obj.waterMax, this.obj.water + 10 );
                    this.obj.food = Math.min(this.obj.foodMax, this.obj.food + 10 );
                    this.obj.life = Math.min(this.obj.lifeMax, this.obj.life + 10 );
                    this.obj.xp = this.obj.xp + 1 ;

                }else{


                    this.obj.water = Math.max(0, this.obj.water - 5 );
                    this.obj.food = Math.max(0, this.obj.food - 5 );
                    if ( autoDammages > 0 ){
                        message += `, life -${autoDammages}`;
                        this.obj.life = Math.max(0, this.obj.life - autoDammages);
                    }

                }
    

    
        
                if ( this.obj.life <= 0 ){
    
                    message += `...death` ;
    
                    addMessageOnChara( this.obj._id, message);
    
                    this.die( res => {});
    
                }else{
    
                    addMessageOnChara( this.obj._id, message );
    
                    updateCharaValuesData(this.obj._id, {
                        life : this.obj.life,
                        water : this.obj.water, 
                        food : this.obj.food,
                        xp : this.obj.xp,
                        actions : charaModel.actions,
                        moves : charaModel.moves
                    });
                }


            }


            findBuildingOnPosition( this.obj.position).then(building => {

                end(building);

            }).catch( err => end(null));

        });

    }
    makeAction(actionType : string, target : Pattern, callback : CallableFunction ){

        switch ( actionType){
            case "heal" :
                this.heal(target, callback);
            break ;
            case "attack" :
                this.attack(target, callback);
            break ;
            case "puiser de l'eau" : 
                this.drawWater(target, callback);
            break ;
            case "chasser" : 
                this.hunt(target, callback);
            break ;
            case "bûcheronner" : 
                this.lumberjack(target, callback);
            break ;
            case "prier" : 
                this.pray(target, callback);
            break ;
            case "addMercenari" :
                this.addMercenari(target, callback);
            break ;
            case "attackMercenari" :
                this.attackMercenari(target, callback);
            break ;
            case "addWood" :
                this.upgreatBuilding(target, callback);
            break ;
            case "plunder" :
                this.plunder(target, callback);
            break ;
        }

    }
    incrementValues(datas: any, callback : (chara:CharaI)=>void){
        incCharaValuesData( this.obj._id, datas).then( res => {
            if ( res.ok ){
                callback(res.value);
            }else{
                callback(null);
            }
        }).catch( err => callback(null));
    }
    attack( target : Pattern, callback){

        if ( this.obj.actions > 0 && (!target['clan'] || target['clan'] !== this.obj['clan']) ){

            super.attack(target, attackRes => {

                let valuesIncThis = {
                    actions : -1
                }

                let targetName = `${target.obj.clan} ${target.obj.name}` ;
                if ( target.obj['type'] === "monster" ){
                    targetName = target.getName();
                }

                let message = `D100 ${attackRes.D100} ${this.obj['clan']} ${this.obj['name']} attack ${targetName} life -${attackRes.dammage}`
                let messageTarget = `D100 ${attackRes.D100} ${this.obj['clan']} ${this.obj['name']} attack ${targetName} life -${attackRes.dammage}`
                if ( attackRes.counter ){
                    if ( attackRes.death ){
                        message = `D100 ${attackRes.D100} ${targetName} counter ${this.obj['clan']} ${this.obj['name']} life -${attackRes.dammage} death`;
                        messageTarget = `D100 ${attackRes.D100} ${targetName} counter ${this.obj['clan']} ${this.obj['name']} life -${attackRes.dammage} death`;
                    }else{
                        message = `D100 ${attackRes.D100} ${targetName} counter ${this.obj['clan']} ${this.obj['name']} life -${attackRes.dammage}`;
                        messageTarget = `D100 ${attackRes.D100} ${targetName} counter ${this.obj['clan']} ${this.obj['name']} life -${attackRes.dammage}`;
                    }
                }else if ( attackRes.death ){
                    message += " death" ;
                    messageTarget += " death";
                    let gold = 1+Math.floor(Math.random()*19) ;
                    if ( target.obj.type === "chara" ){
                        gold = Math.floor(target.obj.gold/2) ;
                        messageTarget += ` gold -${gold}`;
                    }
                    valuesIncThis['gold'] = gold ;
                    const addLvl = this.addLevel(1/5) ;
                    valuesIncThis = {...valuesIncThis, ...addLvl };
                    message += ` xp +${2} gold +${gold}`;
                    if ( addLvl.xp ){
                        message += "LVL UP!";
                    }
                }

                console.log(valuesIncThis);

                this.incrementValues(valuesIncThis, charaRes => {
                    addMessageOnChara(this.obj._id, message ).then( charaUpdated => {
                    
                        
                        updateSocketsValues({
                            x : this.obj.position[0],
                            y : this.obj.position[1]},[
                                {
                                    _id : this.obj._id,
                                    actions : charaRes.actions,
                                    gold : charaRes.gold,
                                    xp : charaRes.xp,
                                    level: charaRes.level,
                                    messages : charaUpdated.value.messages }
                            ]
                        );
                        if ( target.obj.type === "chara" ){

                            addMessageOnChara(target.obj._id, messageTarget ).then( targetU => {
                                const targetF = targetU.value ;

                                console.log('death message sent to target');

                                updateSocketsValues({
                                    x : target.obj.position[0],
                                    y : target.obj.position[1]},[
                                        {
                                            '_id' : targetF._id,
                                            'actions' : targetF.actions,
                                            'messages' : targetF.messages
                                        }
                                    ]
                                    );
                            
                            });

                        }
                        callback(attackRes);
                    });
                });

            });

        }else{

            callback({
                err : 'cannot attack.'
            });
        }

    }
    heal( target : Pattern, callback ){

        if ( 
            this.obj.actions > 0 && 
            this.obj.water >= 5 && 
            this.obj.food >= 5 && 
            (!target.obj['clan'] || target.obj['clan'] === this.obj['clan']) &&
            target.obj['life'] < target.obj['lifeMax']
            ){


            const D100 = 1 + Math.floor(Math.random()*99);

            let adder = Math.min(target.obj['lifeMax']-target.obj['life'], 10 + Math.ceil(D100*0.2));

            this.incrementValues({
                'actions': -1,
                'water' : -5,
                'food' : -5
            }, charaUpdated => {
                target.incrementValues({ 'life' : adder }, targetU => {

                    addMessageOnChara( this.obj._id, `D100 ${D100} soin ${this.obj.clan} ${this.obj.name} => ${target.obj.clan} ${target.obj.name} life +${adder}`).then( charaUpRes => {

                        const charaF = charaUpRes.value || charaUpdated ;

                        addMessageOnChara( target.obj._id, `D100 ${D100} soin ${this.obj.clan} ${this.obj.name} => ${target.obj.clan} ${target.obj.name} life +${adder}`).then( targetUpRes => {

                            const targetF = targetUpRes.value ;
    
                            updateSocketsValues({
                                x : this.obj.position[0],
                                y : this.obj.position[1]},[
                                    {
                                        '_id' : this.obj._id,
                                        'actions' : charaF.actions,
                                        'water' : charaF.water,
                                        'food' : charaF.food,
                                        'messages' : charaF.messages
                                    },
                                    {
                                        '_id' : target.obj._id,
                                        'life' : targetF.life,
                                        'messaages' : targetF.messages
                                    }
        
                                ]
                                );
                            
                            callback({ done : true});

                        });

                    });
                    
                });
            });


        }else{

            callback({
                err : 'canont heal.'
            });
        }


    }

    drawWater(target : any, callback){

        if ( this.obj && this.obj.actions > 0 ){

            getCalculs( calculs => {

                const D100 = 1 + Math.floor(Math.random()*99);
                let caseFactor = calculs.drawWater.desert ;
                if ( WorldPattern.isOnNeutral( this.obj.position[0], this.obj.position[1]) ){
                    caseFactor = calculs.drawWater.neutral ;
                }else if ( WorldPattern.isOnDesert(  this.obj.position[0], this.obj.position[1])){
                    caseFactor = calculs.drawWater.desert ;
                }else{
                    caseFactor = calculs.drawWater.desert *
                    WorldPattern.getDangerRatio(this.obj.position[0], this.obj.position[1]);
                }

                let water = Math.max(
                    0,
                    Math.floor(
                    (D100 *
                        (Math.log10(this.obj.dowser/4) +
                        Math.log10((this.obj.defense/4))/3
                        )) * caseFactor
                    )
                );
                
                const waterF = Math.min( this.obj.waterMax - this.obj.water, water );

                this.incrementValues({
                    'actions': -1,
                    'water' : + waterF
                }, charaInc => {

                    addMessageOnChara( this.obj._id, `D100 ${D100} water +${waterF}`).then( charaUpdated => {
    
                        if ( charaUpdated.ok ){
    
                            const charaF = charaUpdated.value ;
    
                            updateSocketsValues({
                                x : this.obj.position[0],
                                y : this.obj.position[1]},[
            
                                    {
                                        '_id' : charaF['_id'],
                                        'actions' : charaF.actions,
                                        'water' : charaF.water,
                                        'messages' : charaF.messages
                                    }
            
                                ]
                                );
                            
                            callback({ done : true});
    
                        }else{
    
                            callback({err : 'message error'});
    
                        }
    
                    });

                });

            });


        }else{
            callback({err : 'no actions'});
        }
    }
    hunt(target : any, callback){      
        if ( this.obj && this.obj.actions > 0 ){

            getCalculs( calculs => {

                const D100 = 1 + Math.floor(Math.random()*99);
                let caseFactor = 0.25 ;
                if ( WorldPattern.isOnNeutral( this.obj.position[0], this.obj.position[1]) ){
                    caseFactor = calculs.hunt.neutral ;
                }else if ( WorldPattern.isOnDesert(  this.obj.position[0], this.obj.position[1])){
                    caseFactor = calculs.hunt.desert ;
                }else{
                    caseFactor = calculs.hunt.desert  *
                    WorldPattern.getDangerRatio(this.obj.position[0], this.obj.position[1]);
                }

                let food = Math.max(
                    0,
                    Math.floor(
                    (D100 *
                        (Math.log10(this.obj.hunter/4) +
                        Math.log10((this.obj.attack/4))/3
                        )) * caseFactor
                    )
                );

                let foodF = Math.min( this.obj.foodMax - this.obj.food, food );

                this.incrementValues({
                    'actions': -1,
                    'food' : + foodF
                }, charaInc => {

                
                    addMessageOnChara( this.obj._id, `D100 ${D100} food +${foodF}`).then( charaUpdated => {


                        if ( charaUpdated.ok ){

                            const charaF = charaUpdated.value ;
                            updateSocketsValues({
                                x : this.obj.position[0],
                                y : this.obj.position[1]},[
            
                                    {
                                        '_id' : charaF['_id'],
                                        'actions' : charaF.actions,
                                        'food' : charaF.food,
                                        'messages' : charaF.messages
                                    }
            
                                ]
                                );
                            callback({ done : true});

                        }else{
                            callback({ err : 'message error'});
                        }

                    });


                });

            });

        }else{
            callback({err : 'no actions'});
        }
    }
    lumberjack(target : any, callback){
        
        if ( this.obj && this.obj.actions > 0 ){

            getCalculs(calculs => {


                const D100 = 1 + Math.floor(Math.random()*99);
                let caseFactor = 0.0125 ;
                if ( WorldPattern.isOnNeutral( this.obj.position[0], this.obj.position[1]) ){
                    caseFactor = calculs.lumberjack.neutral ;
                }
                if ( target 
                    && target.obj 
                    && target.obj.type === "tree" 
                    && target.obj.life >= 20 ){
                    caseFactor = 1 ;
                    target.incrementValues({life : -20}, res => {

                    });
                }

                let wood = Math.max(
                    1,
                    Math.floor(
                    (D100 *
                        (Math.log10(this.obj.lumberjack/4) +
                        Math.log10((this.obj.attack/4))/3
                        )) * caseFactor
                    )
                );

                let woodF = Math.min( this.obj.woodMax - this.obj.wood, wood );

                this.incrementValues({
                    'actions': -1,
                    'wood' : + woodF
                }, charaInc => {

                    addMessageOnChara( this.obj._id, `D100 ${D100} wood +${woodF}`).then( charaUpdated => {

                        if ( charaUpdated.ok ){

                            const charaF = charaUpdated.value ;

                            updateSocketsValues({
                                x : this.obj.position[0],
                                y : this.obj.position[1]},[
        
                                    {
                                        '_id' : charaF['_id'],
                                        'actions' : charaF.actions,
                                        'wood' : charaF.wood,
                                        'messages' : charaF.messages
                                    }
        
                                ]
                                );
                            
                            callback({ done : true});

                        }else{
                            callback({ err : 'error message'});
                        }


                    });

                });

            });

        }else{
            callback({err : 'no actions'});
        }
    }
    pray(target : any, callback){
        
        if ( this.obj && this.obj.actions > 0 ){

            getCalculs( calculs => {

                const D100 = 1 + Math.floor(Math.random()*99);
                let caseFactor = 0.25 ;
                if ( WorldPattern.isOnNeutral( this.obj.position[0], this.obj.position[1]) ){
                    caseFactor = calculs.pray.neutral ;
                }

                let faith = Math.max(
                    1,
                    Math.floor(
                    (D100 *
                        (Math.log10(this.obj.priest/4) +
                        Math.log10((this.obj.defense/4))/3
                        )) * caseFactor
                    )
                );

                let faithF = Math.min(this.obj.faithMax-this.obj.faith, faith);

                this.incrementValues({
                    'actions': -1,
                    'faith' : + faithF
                }, charaUpdated => {


                    addMessageOnChara( this.obj._id, `D100 ${D100} faith +${faithF}`).then( charaUpdated => {

                        if ( charaUpdated.ok ){

                            const charaF = charaUpdated.value ;

                            updateSocketsValues({
                                x : this.obj.position[0],
                                y : this.obj.position[1]},[
                                    {
                                        '_id' : charaF['_id'],
                                        'actions' : charaF.actions,
                                        'faith' : charaF.faith,
                                        'messages' : charaF.messages
                                    }
                                ]
                                );
                            
                            callback({ done : true});

                        }else{

                            callback({err : 'error message'});

                        }

                    });

                });

            });

        }else{
            callback({err : 'no actions'});
        }
    }
    addMercenari( target : CapitalPattern, callback ){
        if ( this.obj.gold >= 20 && target.obj.mercenaries < (target.obj.mercenariesMax || 20) ){

            this.incrementValues({ gold : -20}, charaRes => {

                incBuildingValuesData( target.obj._id, { mercenaries : +1} ).then ( capRes => {

                    updateSocketsValues({
                        x : target.obj.position[0],
                        y : target.obj.position[1]},[
                            {
                                "_id" : charaRes._id,
                                "gold" : charaRes.gold
                            },
                            {
                                '_id' : capRes.value['_id'],
                                'mercenaries' : capRes.value['mercenaries']
                            }
                        ]
                        );

                        callback(true);


                });

            });

        }
    }
    attackMercenari( target : CapitalPattern, callback ){

        if ( this.obj.actions > 0 && target.obj.mercenaries > 0 ){
            incBuildingValuesData(target.obj._id, { mercenaries : -1}).then( targetRes => {

                if ( this.obj.life <= target.obj.mercenaries*3 ){
                    this.die( dieRes => {
                     
                        updateSocketsValues({
                            x : target.obj.position[0],
                            y : target.obj.position[1]},[
                                {
                                    '_id' : targetRes.value['_id'],
                                    'mercenaries' : targetRes.value['mercenaries']
                                }
                            ]
                            );

                            callback(true);

                    });

                }else{

                    this.incrementValues({ 'actions' : -1, 'life' : - target.obj.mercenaries*3 }, charaRes => {

                        updateSocketsValues({
                            x : target.obj.position[0],
                            y : target.obj.position[1]},[
                                {
                                    '_id' : targetRes.value['_id'],
                                    'mercenaries' : targetRes.value['mercenaries']
                                },
                                {
                                    '_id' : this.obj._id,
                                    "actions" : charaRes.actions,
                                    "life" : charaRes.life
                                }
                            ]
                            );
            
                        callback(targetRes);
    
                    });
                }
            });

        }else{
            callback(null);
        }

    }
    upgreatBuilding(target: Pattern, callback ){

        console.log('updateBuilding in capital', target.obj);
        if ( this.obj.wood >= 10 && target instanceof CapitalPattern && target.obj.mercenariesMax < 50 ){

            this.incrementValues({wood : -10}, charaRes => {

                if ( target instanceof CapitalPattern ){
                    (target as CapitalPattern).upgreatBuilding(1, capitalRes => {

                        updateSocketsValues( 
                            {x : charaRes.position[0],y:charaRes.position[1]},
                            [{
                                _id : charaRes._id,
                                wood : charaRes.wood
                            },
                            {
                                _id : capitalRes._id,
                                mercenariesMax : capitalRes['mercenariesMax']
                            }]
                        );

                    });
                }

            });

        }

    }
    plunder(target : CapitalPattern, callback ){

        if ( this.obj.actions > 0 ){

            target.plunder(this, plunderRes => {

                if ( plunderRes ){

                    if ( plunderRes['gold'] ){

                        this.incrementValues({
                            gold : 1,
                            actions : -1
                        }, incRes => {

                            if ( plunderRes['mercenariesMax'] ){

                                addMessageOnChara( this.obj._id, `gold +${plunderRes['gold'] } death` ).then( chara => {

                                    updateSocketsValues({x:this.obj.position[0], y:this.obj.position[1]}, [
                                        {
                                            _id : this.obj._id,
                                            gold : chara.value.gold,
                                            actions : chara.value.actions,
                                            messages : chara.value.messages
                                        },
                                        {
                                            _id : target.obj._id,
                                            mercenariesMax : plunderRes['mercenariesMax']
                                        }
                                    ])

                                });

                            }else{

                                addMessageOnChara( this.obj._id, `gold +${plunderRes['gold'] }` ).then( chara => {

                                    updateSocketsValues({x:this.obj.position[0], y:this.obj.position[1]}, [
                                        {
                                            _id : this.obj._id,
                                            gold : chara.value.gold,
                                            actions : chara.value.actions,
                                            messages : chara.value.messages
                                        }
                                    ])

                                });

                            }

                        });

                    }else{

                        this.incrementValues({
                            gold : 1,
                            actions : -1
                        }, charaRes => {

                            addMessageOnChara( this.obj._id, 'attack empty' ).then( chara => {

                                updateSocketsValues({x:this.obj.position[0], y:this.obj.position[1]}, [
                                    {
                                        _id : this.obj._id,
                                        actions : chara.value.actions,
                                        messages : chara.value.messages
                                    }
                                ])

                            });

                        });

                    }

                }

                callback(null);

            });

        }else{
            callback(null);
        }


    }

    addLevel(number){


        const ratio = 1/Math.floor(this.obj.level) ;

        const oldLevel = this.obj.level ;
        const newLevel = parseFloat(this.obj.level) + number*ratio  ;

        if ( Math.floor(newLevel) > Math.floor(oldLevel) ){

            const xpAdder = Math.ceil(this.obj.level*2.5);

            return { level : number*ratio, xp : xpAdder, kills : 1};

        }else{

            return { level : number*ratio, kills : 1} ;

        }

    }

    die( callback ){

        const newPos = { 
            x: Math.floor(-2+Math.random()*4), 
            y: Math.floor(-2+Math.random()*4)
        }
        
        updateCharaPositionDatas(this.obj._id, newPos.x, newPos.y).then( posRes => {
        
            updateCharaValuesData(this.obj._id, {
                life : 100,
                gold : this.obj.gold/2,
            }).then( updateLifeRes => {
    
                super.die(dieRes => {

                    findCharaDatasByID(this.obj._id).then ( charaRes => {

                        socketsAdd(newPos, fixObjDatas(charaRes) );
                        socketsResurrection(charaRes);


                        callback(null);

                    });

                });

    
            });

        });
    }
}