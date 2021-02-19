import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WorldFloor } from '../classes/world/floor.world';
import { WorldModel } from '../classes/world/model.world';
import { CharaI } from '../interfaces/chara.interface';
import { UserI } from '../interfaces/user.interface';


export const newChara = {
  _id : 'dfzoifhjmalekjbfzf',
  name : 'JeanJean',
  img : '/assets/images/avatar.png',
  clan : 'clan1',
  level : 1,
  sexe : 'masculin',
  race : 'human', 
  religion : 'chaman',

  x : 0,
  y : 0,
  life :  Math.floor(Math.random()*100),
  lifeMax : 100,
  moves: 12,
  actions : 8,
  xp : 50,

  water : Math.floor(Math.random()*40),
  food :  Math.floor(Math.random()*40),
  wood :  Math.floor(Math.random()*40),
  faith : Math.floor(Math.random()*40),

  attack : 5,
  defense : 5,
  dowser : 5,
  hunter : 5,

  messages : [
    'D100 48 vous avez attack Clan1 JeanMark lui infligeant 58 de dégâts',
    'D100 84 vous avez juste joué aux dés'
  ]
};


@Injectable({
  providedIn: 'root'
})
export class UserService {


  private user : UserI = null ;
  public chara : CharaI = null ;

  public subject : ReplaySubject<UserI> = new ReplaySubject();
  public charaSubject : ReplaySubject<CharaI> = new ReplaySubject();

  public moveEmitter : EventEmitter<{_id:string, newX: number, newY : number}> = new EventEmitter();
  public addEmitter : EventEmitter<any> = new EventEmitter();
  public updatesEmitter : EventEmitter<any[]> = new EventEmitter();
  public removeEmitter : EventEmitter<string> = new EventEmitter();
  public resurrectionEmitter : EventEmitter<Object> = new EventEmitter();


  socketChara = null ;

  constructor(
    private router : Router,
    private http : HttpClient
  ) { 


    this.subject.subscribe( (user) => {
      
      localStorage.setItem('token', user.token);
      
      this.user = user ;
      this.chara = user.chara ;
      this.charaSubject.next(this.user.chara);

    
    });

    this.socketChara = null ;

    this.charaSubject.subscribe( chara => {

      if ( chara ){

        if ( !this.socketChara ){
          this.runSocketChara();

        }

      }

    })


    if ( localStorage.getItem('token') ){

      this.http.get(`${environment.urlApi}/user/read`).subscribe( usr => {

        if ( usr ){
          this.subject.next({
            _id : usr['_id'],
            name : usr['name'],
            img : usr['img'] || '/assets/images/avatar.png',
            token : localStorage.getItem('token'),
            chara : usr['chara'],
            ...usr
          });
        }

      }, err => {
        console.log(err);
      });

    }

  }
  runSocketChara(){

    console.log('init socket')
    const io = require("socket.io-client") ;
    this.socketChara = io(`${environment.domain}`, {
      path : '/api/user/chara/socket',
      auth : { 
        token : localStorage.getItem('token')
      }
    });
    this.socketChara.on('connect', ()=> {  
      console.log('connected');

    });
    this.socketChara.on('move', ( _id : string, x : number, y : number)=> {
      this.moveEmitter.emit({ _id :  _id, newX :  x, newY :  y });
    });
    this.socketChara.on('addChara', ( chara )=> {
      this.addEmitter.emit(chara);
    });
    this.socketChara.on('add', ( obj )=> {
      this.addEmitter.emit(obj);
    });
    this.socketChara.on('resurrection', ( obj )=> {
      console.log('resurrection');
      this.updateChara(obj);
      this.resurrectionEmitter.emit(obj);
    });
    this.socketChara.on('updateDatas', ( datas )=> {
      datas.forEach(element => {
          if ( element['_id'] && this.chara['_id'] === element['_id'] ){
            this.user.chara = {...this.chara, ...element};
            this.updateUser(this.user);
          }
      });
      this.updatesEmitter.emit(datas);
    });
    this.socketChara.on('removeObj', ( datas )=> {
      this.removeEmitter.emit(datas);
    });


  }
  updateCharaValue(key, number){

    if ( this.user.chara ){

      const nc = this.user.chara ;
      nc[key] = number ;
      this.subject.next(this.user);

    }

  }
  createNew(user : { name : string, email : string, password : string}, callback? : CallableFunction ){

    Reflect.deleteProperty(user,'confirm');

    this.http.post( `${environment.urlApi}/user/create`, user ).subscribe( res => {
      
      if ( res && res['token'] ){

        const user = {
          _id : res['_id'],
          name : res['name'],
          img : res['img'],
          token : res['token'],
          chara : res['chara'],
          ...res
        };

        this.subject.next( user );
        callback(this.user);

      } else{
        callback(null);
      }
    }, err => {
      if ( err['error'] ){
        console.log(err);
        alert(err['error']['message']);
      }
      callback(null);
    });
    
  }
  createChara(chara : {
    name : string, sexe: string, race : string, religion : string
  }, callback : CallableFunction){


    this.http.post(`${environment.urlApi}/user/createChara`, chara).subscribe( res => {

      if ( res ){

        let newUser = this.user ;
        newUser.chara = this.buildCharaDatas(res);

        this.subject.next(newUser);
        callback(res);

      }else{

        callback(null);

      }



    });

    // setTimeout(()=> {

    //   let newUser = this.user ;
    //   newUser.chara = newChara ;

    //   this.subject.next(newUser);

    //   callback(newChara);

    // },1000);

  }
  buildCharaDatas( res ){
    return {
      _id : res['_id'],
      name : res['_id'],
      img : res['img'],
      sexe : res['sexe'],
      race : res['race'],
      religion : res['religion'],
      level : res['level'],
      clan : res['clan'],
      
      x : res['x'],
      y : res['y'],
  
      life : res['life'],
      lifeMax : res['lifeMax'],
      moves : res['moves'],
      actions : res['actions'],
      xp : res['xp'],
      water : res['water'],
      food : res['food'],
      wood : res['wood'],
      faith : res['faith'],
  
      defense : res['defense'],
      attack : res['attack'],
      hunter : res['hunter'],
      dowser : res['dowser'],
  
      messages : [],
      ...res };
  }

  addSkill(skill:string){

    this.http.post(`${environment.urlApi}/user/chara/incValue`, { key : skill, inc : 1 }).subscribe( res => {


      this.user.chara = this.buildCharaDatas(res); ;
      this.subject.next(this.user);

    });


  }
  getActionsOn(floor : WorldModel, target = null ){
    
    if ( !target && floor instanceof WorldModel && floor.x === this.chara.x && floor.y === this.chara.y ){

      if ( floor.type === "floor" ){
        return [
          {
            name : `puiser de l'eau`,
            icon : "icon-water",
            action : `puiser de l'eau`
          },
          {
            name : "chasser", 
            icon : "icon-attack",
            action : `chasser`
          },
          {
            name : "bûcheronner",
            icon : "icon-wood",
            action : `bûcheronner`
          },
          {
            name : "prier",
            icon : "icon-pray",
            action : "prier"
          }
        ]
      }else if ( floor.type === "capital" ){

        console.log('clan', floor['datas'] );

        if ( floor['datas']['clan'] === this.chara.clan ){
          return [
            {
              name : `${floor['datas']['mercenaries']}/50 ajouter mercenaire `,
              icon : "icon-pray" ,
              action : "addMercenari"
            }
          ]
        }else{
          if ( floor['datas']['mercenaries'] > 0 ){
            return [
              {
                name : `${floor['datas']['mercenaries']}/50 attaquer mercenaire`,
                icon : "icon-attack",
                action : "attackMercenari"
              }
            ]
          }else{
            return [
              {
                name : `piller`,
                icon : "icon-attack",
                action : "plunder"
              }
            ]
          }

        }


      }

    }else if ( target && target.x === this.chara.x && target.y === this.chara.y ){
      if ( target.type === "monster" ){
        return [
          `attack`,
        ]
      }else if ( target.type === "chara" ){

        if ( target['clan'] === this.chara.clan ){
          return [
            'heal'
          ] ;
        }else if ( floor.getName() !== "neutral" ){
          return [
            "attack",
          ] ;
        }
      } 
    }
    return [] ;
  }
  makeAction(target : WorldModel, action:string){
    
    const targetF = {
      _id : target['_id'],
      type : target.type,
      name : target['name']
    };

    this.http.post(`${environment.urlApi}/user/chara/action`, {
      target : targetF,
      action : action
    }).subscribe( res => {

      
    });

    //this.updateCharaValue('life', this.chara.life + 10 );
  }
  updateUser( user ){
    this.subject.next(user);
  }
  updateChara( chara ){
    
    this.user.chara = chara ;
    this.subject.next(this.user);

  }

  login(values, callback){

    this.http.post(`${environment.urlApi}/user/login`, values).subscribe( res => {
      
      if ( res && res['token']){

          const user = {
            _id : res['_id'],
            name : res['name'],
            img : res['img'],
            token : res['token'],
            chara : res['chara'],
            ...res
          };

          this.subject.next( user );
          callback(this.user);
        }else{
          callback(null);
        }
        
    });
    
  }

  logOut(){
    localStorage.removeItem('token');
    this.subject.next(null) ;
    this.router.navigate(['/connexion']);
    setTimeout(()=> {
      window.location.reload();
    },10);
  }

  move( mover : {x : number, y : number}, callback ){

    this.http.post(`${environment.urlApi}/user/chara/move`, mover ).subscribe( moveRes => {

      if ( moveRes ){
        callback(moveRes);
      }

    });

  }

}
