import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }

  addMessageTemplate(message : any){

    let template = document.createElement('p') ;

    const styleIcon = `style="
    transform : scale(1.5,1.5) ;
    "`;
    
    const words = message['message'].split(' ');
    for ( let word of words ){
      if ( word === "D100" ){
        template.innerHTML += `<span class='icon icon-dice' ${styleIcon} ></span>` ;
      }else if ( word === "attack" ){
        template.innerHTML += `<span class='icon icon-attack' ${styleIcon}></span>` ;
      }else if ( word === "water" ){
        template.innerHTML += `<span class='icon icon-water' ${styleIcon}></span>` ;
      }else if ( word === "food" ){
        template.innerHTML += `<span class="icon icon-food" ${styleIcon}></span>` ;
      }else if ( word === "wood" ){
        template.innerHTML += `<span class='icon icon-wood' ${styleIcon}></span>` ;
      }else if ( word === "faith" ){
        template.innerHTML += `<span class='icon icon-faith' ${styleIcon}></span>` ;
      }else{
        template.innerHTML += `${word} ` ;
      }
    }

    return template ;

  }

  createMessageTemplate(message : any){

    let final = `<div 
    style="width:100%;
    height:2rem ;
    display : flex ;
    flex-direction : row wrap ;
    align-items : center ;
    ">` ;

    const styleIcon = `style="
    transform : scale(1.5,1.5) ;
    "`;
    
    const words = message.split(' ');
    for ( let word of words ){
      if ( word === "D100" ){
        final += `<div class='icon icon-dice' ${styleIcon} ></div>` ;
      }else if ( word === "attack" ){
        final += `<div class='icon icon-attack' ${styleIcon}></div>` ;
      }else if ( word === "water" ){
        final += `<div class='icon icon-water' ${styleIcon}></div>` ;
      }else if ( word === "food" ){
        final += `<div class="icon icon-food" ${styleIcon}></div>` ;
      }else if ( word === "wood" ){
        final += `<div class='icon icon-wood' ${styleIcon}></div>` ;
      }else if ( word === "faith" ){
        final += `<div class='icon icon-faith' ${styleIcon}></div>` ;
      }else{
        final += `${word} ` ;
      }
    }
    final += '</div>';

    return final ;

  }

}
