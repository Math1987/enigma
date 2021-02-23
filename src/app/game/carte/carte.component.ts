import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { WorldChara } from 'src/app/shared/classes/world/chara.world';
import { WorldFloor } from 'src/app/shared/classes/world/floor.world';
import { WorldModel } from 'src/app/shared/classes/world/model.world';
import { WorldMonster } from 'src/app/shared/classes/world/monster.world';
import { WorldViewer } from 'src/app/shared/classes/world/world.viewver';
import { CharaI } from 'src/app/shared/interfaces/chara.interface';
import { UserService } from 'src/app/shared/services/user.service';
import { WorldService } from 'src/app/shared/services/world.service';
import { ViewverService } from './viewver.service';


@Component({
  selector: 'app-carte',
  templateUrl: './carte.component.html',
  styleUrls: ['./carte.component.scss']
})
export class CarteComponent implements OnInit, AfterViewInit {

  @ViewChild('mapCanvas') mapCanvas ;

  constructor(
    public user : UserService,
    public world : WorldService,
    public viewS : ViewverService
  ) { 

  }

  ngOnInit(): void {

  }
  ngAfterViewInit(){

    
    this.user.charaSubject.pipe( first()).subscribe( chara => {

      this.viewS.buildMap();
      this.drawMapCanvas();

    })

  }

  drawMapCanvas(){

    const canvas = this.mapCanvas.nativeElement as HTMLCanvasElement ;
    canvas.width = canvas.offsetWidth ;
    canvas.height = canvas.offsetHeight ;
    const context = canvas.getContext('2d') ;

    const img = new Image();

    img.addEventListener('load', ev => {


      const midle = {
        x : 24/512,
        y : 0,
        w : 94/512,
        h : 24/512
      }

      const corner = {
        x : 0,
        y : 0,
        w : 24/512,
        h : 24/512
      }


      context.save();
      context.translate(canvas.width/2, canvas.height/2);
      context.rotate(Math.PI/2);
      context.translate(-canvas.height/2,-canvas.width/2);
      for ( let y = 0 ; y < canvas.height ; y += canvas.height*midle.h ){

          context.drawImage( 
            img,
            midle.x*img.width,
            midle.y*img.height,
            midle.w*img.width,
            midle.h*img.height,
            y,
            0,
            canvas.width*midle.w, 
            canvas.height*midle.h
            );
            context.drawImage( 
              img,
              midle.x*img.width,
              midle.y*img.height,
              midle.w*img.width,
              midle.h*img.height,
              y,
              canvas.width - canvas.height*midle.h,
              canvas.width*midle.w, 
              canvas.height*midle.h
              );
        }
        context.restore();
      for ( let x = 0 ; x < (canvas.width) ; x += canvas.width*midle.w ){
        context.drawImage( 
          img,
          midle.x*img.width,
          midle.y*img.height,
          midle.w*img.width,
          midle.h*img.height,
          x,
          0,
          canvas.width*midle.w, 
          canvas.height*midle.h
          );
          context.drawImage( 
            img,
            midle.x*img.width,
            midle.y*img.height,
            midle.w*img.width,
            midle.h*img.height,
            x,
            canvas.height - canvas.height*midle.h,
            canvas.width*midle.w, 
            canvas.height*midle.h
            );
      }

      context.restore();

      context.drawImage( 
        img,
        0,
        0,
        corner.w*img.width,
        corner.h*img.height,
        0,
        0,
        canvas.height*corner.w, 
        canvas.height*corner.h
        );

        context.drawImage( 
          img,
          0,
          0,
          corner.w*img.width,
          corner.h*img.height,
          canvas.width - canvas.height*corner.h,
          0,
          canvas.height*corner.w, 
          canvas.height*corner.h
          );

          context.drawImage( 
            img,
            0,
            0,
            corner.w*img.width,
            corner.h*img.height,
            canvas.width - canvas.height*corner.h,
            canvas.height -  canvas.height*corner.h,
            canvas.height*corner.w, 
            canvas.height*corner.h
            );

            context.drawImage( 
              img,
              0,
              0,
              corner.w*img.width,
              corner.h*img.height,
              0,
              canvas.height - canvas.height*corner.h,
              canvas.height*corner.w, 
              canvas.height*corner.h
              );

    });

    canvas.style.transform = "scale(1.01,1.01)";
    img.src="/assets/images/sprite_ui.png" ;
  }


}
