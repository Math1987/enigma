/** 
 * VIEWVER SERVICE
 * 
 * this service used by map component 
 * bind a viewver object to a user service
 * 
 */

import { EventEmitter, Injectable } from '@angular/core';
import { WorldViewer } from 'src/app/shared/classes/world/world.viewver';
import { CharaI } from 'src/app/shared/interfaces/chara.interface';
import { UserService } from 'src/app/shared/services/user.service';
import { WorldService } from 'src/app/shared/services/world.service';


@Injectable({
  providedIn: 'root'
})
export class ViewverService {

  public viewver : WorldViewer = null ;
  private mapHtml : HTMLDivElement = null ;
  /**
   * initEmitter inform when viewver is created
   */
  public initEmitter : EventEmitter<boolean> = new EventEmitter();

  constructor(
    public user : UserService,
    public world : WorldService
  ) { 

    this.viewver = null ;
    /**
     * for each chara update, check viewver
     */
    this.user.charaSubject.subscribe( chara => {
      this.setViewver(chara);
    });

  }
  /**
   * set vievwer 
   * if viewver is null but chara exist, create the view
   * on map html element.
   */
  setViewver(chara){

      if ( !this.viewver && chara ){
        const map = document.getElementById('map') as HTMLDivElement ;
        if ( map ){
          this.createViewver(map,chara);
        }
      }
  }

  /**
   * buildMap
   * this function is called when 
   * map component init.
   * It can set the view from 0
   * or reload it if viewver has been already loaded
   * (using timeout to be sure than threejs will build after loops event)
   */
  buildMap(){

    setTimeout(()=>{
      const map = document.getElementById('map') as HTMLDivElement ;
      if ( !this.viewver && this.user.chara ){
          this.setViewver(this.user.chara);
          if ( this.viewver ){
            this.viewver.renderOn(map);
            this.initEmitter.emit(true);
          }
      }else if ( this.viewver ){
          this.viewver.renderOn(map);
          this.initEmitter.emit(true);
      }
    },50);

  }

  /**
   * init viewver
   * 
   * create the View and listening to all 
   * events from viewver (as move click action)
   * and user (as realtime updates required from backend service with socket)
   * 
   */
  private createViewver(map : HTMLDivElement, chara: CharaI){
    console.log('createViewver', chara);
    if ( chara ){
      this.viewver = new WorldViewer(map, chara.x, chara.y);

      this.viewver.moverEmitter.subscribe( moveReq => {
        this.user.move( moveReq, res => {
          if ( res ){
            this.viewver.move(moveReq.x, moveReq.y);
            this.user.updateChara(res);
            this.viewver.selectByPosition( this.user.chara.x, this.user.chara.y);
          }
        });
      });

      /**
       * thoose emitions comme from backend and
       * say to the user service that something 
       * is changing on him view area
       */
      this.user.updatesEmitter.subscribe( updates => {
        this.viewver.updatesObjs(updates);  
      });
      this.user.moveEmitter.subscribe( (mover : { _id : string, newX : number, newY : number}) => {
        this.viewver.moveObjOnPositionById(mover._id, mover.newX, mover.newY);
      })
      this.user.addEmitter.subscribe( obj => {
        this.viewver.addInCase(obj.x, obj.y, obj);
      });
      this.user.removeEmitter.subscribe( id => {
        this.viewver.removeObj(id);
        this.viewver.updateSelection();
      });
      this.user.resurrectionEmitter.subscribe( obj => {
        this.viewver.moveTo(obj.x, obj.y);
        this.user.updateChara(obj);
        document.location.reload();
      });
    }

  }

}
