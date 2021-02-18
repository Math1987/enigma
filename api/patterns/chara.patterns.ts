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
import { WorldPattern } from "./world.pattern";

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
        moves : 1000,
        actions : 1000,
        xp : 50,
        water : 10,
        waterMax : 40,
        food : 10,
        foodMax : 40,
        wood : 10,
        woodMax : 40,
        faith : 10,
        faithMax : 40,
        
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
           
            let autoDammages = 0 ;

            const waterUse = Math.min(this.obj.water, 5);
            const foodUse = Math.min(this.obj.food, 5);

            let message = `water -${waterUse}, food -${foodUse}`;

            if ( this.obj.food < 5 ){
                autoDammages = Math.abs(this.obj.food - 5);
            }
            if ( this.obj.water < 5 ){
                autoDammages += Math.abs(this.obj.water - 5 );
            }

            this.obj.water = Math.max(0, this.obj.water - 5 );
            this.obj.food = Math.max(0, this.obj.food - 5 );
            if ( autoDammages > 0 ){
                message += `, life -${autoDammages}`;
                this.obj.life = Math.max(0, this.obj.life - autoDammages);
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
                    actions : charaModel.actions,
                    moves : charaModel.moves
                });
            }
            

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
        }

    }
    incrementValues(datas: any, callback : CallableFunction){
        incCharaValuesData( this.obj._id, datas).then( res => {
            if ( res.ok ){
                callback(res.value);
            }else{
                callback(null);
            }
        }).catch( err => callback(null));
    }
    attack( target : Pattern, callback){


        if ( this.obj.actions > 0 && !target['clan'] || target['clan'] !== this.obj['clan'] ){

            this.incrementValues({'actions': -1}, charaUpdated => {

                super.attack(target, attackRes => {

                    let message = `D100 ${attackRes.D100} attack ${target.obj.name} -${attackRes.dammage}`

                    if ( attackRes.counter ){
                        if ( attackRes.death ){
                            message = `D100 ${attackRes.D100} counter life -${attackRes.dammage} death`;
                        }else{
                            message = `D100 ${attackRes.D100} counter life -${attackRes.dammage}`;
                        }
                    }else if ( attackRes.death ){
                        message = `D100 ${attackRes.D100} kill ${target.obj.name} -${attackRes.dammage}`;
                    }

                    addMessageOnChara(this.obj._id, message).then( charaUpdated => {

                        if ( charaUpdated.ok ){

                            
                            if ( target.obj.type === "chara" ){

                                let message = `${this.obj.name} attack -${attackRes.dammage}`

                                if ( attackRes.counter ){
                                    if ( attackRes.death ){
                                        message = `D100 ${attackRes.D100} counter  ${this.obj.name} life -${attackRes.dammage} death`;
                                    }else{
                                        message = `D100 ${attackRes.D100} counter  ${this.obj.name} life -${attackRes.dammage}`;
                                    }
                                }else if ( attackRes.death ){
                                    message = ` ${this.obj.name} kill -${attackRes.dammage} death`
                                }


                                addMessageOnChara(target.obj._id, message ).then( targetU => {
                                
                                    const targetF = targetU.value ;

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
                            if ( attackRes.death ){

                                this.addLevel(1/5, charaF=>{

                                    if ( charaF.ok ){

                                        updateSocketsValues({
                                            x : this.obj.position[0],
                                            y : this.obj.position[1]},[
                                                {
                                                    '_id' : charaF.value._id,
                                                    'level' : charaF.value.level,
                                                    'xp' : charaF.value.xp,
                                                    'actions' : charaF.value.actions,
                                                    'messages' : charaF.value.messages
                                                }
                                            ]
                                        );
                                        
                                    }
                                        
                                    callback(attackRes);

                                });
                                
                            }else{

                                updateSocketsValues({
                                    x : this.obj.position[0],
                                    y : this.obj.position[1]},[
                                        {
                                            '_id' : charaUpdated.value._id,
                                            'actions' : charaUpdated.value.actions,
                                            'messages' : charaUpdated.value.messages
                                        }
                                    ]
                                    );

                                callback(attackRes);
                            }

         
                        }else{

                            callback(attackRes);

                        }

                    })

                });

            });

        }else{

            callback({
                err : 'canont heal.'
            });
        }

    }
    heal( target : Pattern, callback ){

        if ( this.obj.actions > 0 && !target.obj['clan'] || target.obj['clan'] === this.obj['clan'] ){

            let adder = Math.min(1, Math.max(0,target.obj['lifeMax'] - target.obj['life']) );

            const D100 = 1 + Math.floor(Math.random()*99);

            const water = Math.ceil(Math.min(this.obj['water'], 10 * this.obj['dowser']/100)) ;
            const food = Math.ceil(Math.min(this.obj['food'], 10 * this.obj['dowser']/100)) ;
            adder += Math.ceil((water + food)*D100/100) ;
            adder = Math.min( target.obj['lifeMax'] - target.obj['life'], adder );

            this.incrementValues({
                'actions': -1,
                'water' : -water,
                'food' : -food
            }, charaUpdated => {
                target.incrementValues({ 'life' : adder }, targetU => {

                    addMessageOnChara( this.obj._id, `D100 ${D100} heal ${target.obj.name} +${adder}`).then( charaUpRes => {

                        const charaF = charaUpRes.value || charaUpdated ;

                        addMessageOnChara( target.obj._id, `${this.obj.name} heal +${adder}`).then( targetUpRes => {

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
                let caseFactor = 0.25 ;
                if ( WorldPattern.isOnNeutral( this.obj.position[0], this.obj.position[1]) ){
                    caseFactor = calculs.lumberjack.neutral ;
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

    addLevel(number, callback){

        const ratio = 1/Math.floor(this.obj.level) ;

        const oldLevel = this.obj.level ;
        const newLevel = parseFloat(this.obj.level) + number*ratio  ;

        if ( Math.floor(newLevel) > Math.floor(oldLevel) ){

            const xpAdder = Math.ceil(this.obj.level*2.5);

            this.incrementValues({ level : number*ratio, xp : xpAdder, kills : 1}, chara => {

                addMessageOnChara(this.obj._id, `niveau +1, compétences +${xpAdder}!`).then( charaUpd => {

                    callback(charaUpd);

                });

            });


        }else{

            this.incrementValues({ level : number*ratio, kills : 1}, chara => {

                addMessageOnChara(this.obj._id, `xp +${Math.floor(number*10)}`).then( charaUpd => {

                    callback(charaUpd);

                });


            });

        }

    }

    die( callback ){

        const newPos = { 
            x: Math.floor(-2+Math.random()*4), 
            y: Math.floor(-2+Math.random()*4)
        }
        
        updateCharaPositionDatas(this.obj._id, newPos.x, newPos.y).then( posRes => {

            updateCharaValuesData(this.obj._id, {
                life : this.obj.lifeMax,
                actions : 1000,
                moves : 1000,
                water : 0, 
                food : 0,
                wood : 0, 
                faith : Math.floor(Math.random()*10)
            }).then( updateLifeRes => {
    
                super.die(dieRes => {

                    findCharaDatasByID(this.obj._id).then ( charaRes => {

                        socketsAdd(newPos, fixObjDatas(charaRes) );
                        socketsResurrection(charaRes);

                    });



                    callback(null);
                });

    
            });

        });
    }
}