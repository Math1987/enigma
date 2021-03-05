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
      }else if ( word === "life" ){
        template.innerHTML += `<span class='icon icon-life' ${styleIcon}></span>` ;
      }else{
        template.innerHTML += `${word} ` ;
      }
    }

    return template ;

  }

  createMessageTemplate(message : any){

    let final = `<div 
    style="
    width:100%;
    display : flex ;
    flex-flow: row wrap;
    align-items : center ;
    border-bottom : 1px solid gray ;
    border-top : 1px solid gray ;
    border : 1px solid gray ;
    margin : 2px ;
    "
    >` ;

    const styleIcon = `style="
    transform : scale(1.5,1.5) ;
    padding : 0px ;
    "`;
    
    const words = message.split(' ');
    let i = 0 ;
    while ( i < words.length ){
      let word = words[i];
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
      }else if ( word === "life" ){
        final += `<div class='icon icon-life' ${styleIcon}></div>` ;
      }else if ( word === "xp" ){
        final += `<div class='icon icon-book' ${styleIcon}></div>` ;
      }else if ( word === "death" ){
        final += `<div class='icon icon-death' ${styleIcon}></div>` ;
      }else if ( word === "gold" ){
        final += `<div class='icon icon-gold' ${styleIcon}></div>` ;
      }else if ( word === "tea" ){
        final += `<div class='icon icon-tea' ${styleIcon}></div>` ;
      }else if ( (word as string).includes('clan') ){
        final += `<div class='${word} text-1' ${styleIcon}> ${words[i+1]} </div>` ;
        i ++ ;
      }else if ( word === "pass" ){
        final += `<div class='icon icon-map' ${styleIcon}></div>` ;
      }else{
        final += `${word} ` ;
      }
      i ++ ;
    }
    final += '</div>';

    return final ;

  }

}
