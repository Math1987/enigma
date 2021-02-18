import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WorldViewer } from '../classes/world/world.viewver';
import { CharaI } from '../interfaces/chara.interface';
import { WorldObj } from '../interfaces/world.obj.interface';

import {newChara} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class WorldService {

  constructor(
    private http : HttpClient
  ) { 

    WorldViewer.init(this);

  }

  getCasesArr( arr : any[] , callback : CallableFunction ) {

    this.http.post(`${environment.urlApi}/user/world/get`, arr).subscribe( res => {

      callback(res);

    });

  }

}
