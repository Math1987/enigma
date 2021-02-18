import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  constructor(
    public router : Router,
    public user : UserService
  ) { }

  ngOnInit(): void {

    this.updateMenu(this.router.url);

    this.router.events.subscribe( route => {

      if ( route['url'] ){
        this.updateMenu(route['url']);
      }

    });
  }
  updateMenu(url){
    

    setTimeout(() => {


      const mapMenu = document.querySelector('.menu-map');
      mapMenu.classList.remove('active');
      const charaMenu = document.querySelector('.menu-chara');
      charaMenu.classList.remove('active');
      const pantheonMenu = document.querySelector('.menu-pantheon');
      pantheonMenu.classList.remove('active');
      const forumMenu = document.querySelector('.menu-forum');
      forumMenu.classList.remove('active');

      if ( url.includes('carte')){
        mapMenu.classList.add('active');
        
      }else if (url.includes('personnage')){
        
        charaMenu.classList.add('active');
        
      }else if ( url.includes('pantheon')){
        pantheonMenu.classList.add('active');
        
      }else if ( url.includes('forum')){
        forumMenu.classList.add('active');
      }

    },0);



    // console.log(document.getElementById('buttonChara'));

    // document.getElementById('buttonChara').classList.remove('active');


    
  }

}
