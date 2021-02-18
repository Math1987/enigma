import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RankService } from 'src/app/shared/services/rank.service';

@Component({
  selector: 'app-pantheon',
  templateUrl: './pantheon.component.html',
  styleUrls: ['./pantheon.component.scss']
})
export class PantheonComponent implements OnInit {

  levels : BehaviorSubject<[]> = new BehaviorSubject([]);
  kills : BehaviorSubject<[]> = new BehaviorSubject([]);


  constructor(
    public rank : RankService
  ) { }

  ngOnInit(): void {

    this.rank.getLevels( levels => {
      this.levels.next(levels);
    });
    this.rank.getKills( levels => {
      this.kills.next(levels);
    });

  }

}
