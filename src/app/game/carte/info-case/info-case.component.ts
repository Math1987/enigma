import { Component, OnInit, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { WorldBuilding } from 'src/app/shared/classes/world/building.world';

import { WorldChara } from 'src/app/shared/classes/world/chara.world';
import { WorldFloor } from 'src/app/shared/classes/world/floor.world';
import { WorldModel } from 'src/app/shared/classes/world/model.world';
import { WorldMonster } from 'src/app/shared/classes/world/monster.world';
import { WorldViewer } from 'src/app/shared/classes/world/world.viewver';
import { CharaI } from 'src/app/shared/interfaces/chara.interface';
import { MessageService } from 'src/app/shared/services/message.service';
import { UserService } from 'src/app/shared/services/user.service';
import { WorldService } from 'src/app/shared/services/world.service';
import { ViewverService } from '../viewver.service';

@Component({
  selector: 'app-info-case',
  templateUrl: './info-case.component.html',
  styleUrls: ['./info-case.component.scss']
})
export class InfoCaseComponent implements OnInit {

  targetFloor : WorldModel = null ;
  targetCharas : any[] = [] ;
  targetMonsters : any[] = [] ;

  @ViewChild('mapCanvas') mapCanvas ;

  selectSubscription = null ;

  constructor(
    public user : UserService,
    public world : WorldService,
    public viewer : ViewverService,
    public messageService : MessageService
  ) {}

  ngOnInit(): void {

    this.user.charaSubject.subscribe( chara => {

      if ( chara && chara._id ){ 
        this.updateLastMessage();
      }

    });

    this.viewer.initEmitter.pipe( first()).subscribe( init => {

      setTimeout(()=> {
        this.initSelection();
      },0);

    });

    this.user.updatesEmitter.subscribe( update => {
      this.viewer.viewver.updateSelection();
    })

    this.initSelection();

    if ( this.viewer.viewver ){
      this.viewer.viewver.updateSelection();
    }

  }
  initSelection(){

    if ( this.selectSubscription ){

      this.selectSubscription.unsubscribe();

    }
    if ( this.viewer.viewver ){

      console.log(this.viewer.viewver.selected);

      this.selectSubscription = this.viewer.viewver.selectEmitter.subscribe(selects => {

        this.updateSelectedCase(selects);

      })
    }

  }
  updateSelectedCase( selects : WorldModel[] ){

    let floors = selects.filter( row => row instanceof WorldFloor || row instanceof WorldBuilding );

    this.targetFloor = floors[floors.length-1] ;
    const floorInteractions = this.user.getActionsOn(this.targetFloor, this.targetFloor);
    this.targetFloor['name'] = this.targetFloor.getName();
    this.targetFloor['interactions'] = floorInteractions ;

    this.targetCharas = (selects.filter(row => row instanceof WorldChara ) as WorldChara[]).map( row => {
      row instanceof WorldChara ;
      const interactions = this.user.getActionsOn(this.targetFloor,row);
      const nobj = {...row, ...row.getPassiveInfos(row.datas), interactions : interactions};
      nobj['x'] = row.x ;
      nobj['y'] = row.y ;
      nobj['img'] = row.img ;
      nobj['name'] = row.getName();      
      return nobj ;
    } );

    this.targetMonsters = (selects.filter(row => row instanceof WorldMonster )as WorldMonster[]).map( row => {
      const interactions = this.user.getActionsOn(this.targetFloor,row);
      const nobj = {...row, interactions : interactions};
      nobj['x'] = row.x ;
      nobj['y'] = row.y ;
      nobj['img'] = row.img ;
      nobj['name'] = row.getName()
      return nobj ;
    }) ;

    if ( this.targetFloor instanceof WorldBuilding ){
      this.targetFloor.updateInfoCaseFromContext(this.user.chara, this.targetCharas, this.targetFloor['interactions']);
    }


  }

  updateLastMessage(){

    
    if ( this.user.chara.messages.length > 0 ){

      const div = document.getElementById('lastMessage') as HTMLDivElement ;
      div.innerHTML = ''

      let mes1 = '' ;
      if ( this.user.chara.messages.length > 0 ){
        mes1 = this.messageService.createMessageTemplate( this.user.chara.messages[0] );
      }
      // if ( this.user.chara.messages.length > 1 ){
      //   mes1 += this.messageService.createMessageTemplate( this.user.chara.messages[1] );
      // }

      div.innerHTML = mes1 ;

    }

  }



}
