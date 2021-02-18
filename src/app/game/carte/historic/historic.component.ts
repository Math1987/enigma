import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MessageService } from 'src/app/shared/services/message.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-historic',
  templateUrl: './historic.component.html',
  styleUrls: ['./historic.component.scss']
})
export class HistoricComponent implements OnInit {

  historics : BehaviorSubject<[]> = new BehaviorSubject([]);

  constructor(
    public user : UserService,
    public messageService : MessageService
  ) { }

  ngOnInit(): void {

    this.user.charaSubject.subscribe( chara => {

      const div = document.getElementById('historicContainer') as HTMLDivElement ;
      div.innerHTML = '' ;

      chara.messages.forEach( row => {

        div.innerHTML += this.messageService.createMessageTemplate(row) ;

      });

      

    });

  }

}
