import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RankService {

  kills : BehaviorSubject<Object[]> = new BehaviorSubject([]);

  constructor(
    private http: HttpClient
  ) { 

    setTimeout(()=>{

      let ar  =[] ;
      for ( let i = 0 ; i < 10 ; i ++ ){
        ar.push({
          name : "Jean" + (Math.random()*100).toFixed(2),
          value : i*10 + (Math.random()*10).toFixed(0)
        })
      }

      this.kills.next(ar);

    },500);

  }

  getLevels(callback: CallableFunction){
    this.http.get(`${environment.urlApi}/rank/level`).subscribe( levels => {
      callback(levels);
    }, err => {
      callback([]);
    });
  }
  getKills(callback: CallableFunction){
    this.http.get(`${environment.urlApi}/rank/kill`).subscribe( kills => {
      console.log('kills', kills );
      callback(kills);
    }, err => {
      callback([]);
    });
  }

  getClans(callback : CallableFunction){
    this.http.get(`${environment.urlApi}/rank/clan`).subscribe( clans => {
      console.log('kills', clans );
      callback(clans);
    }, err => {
      callback([]);
    });
  }


}
