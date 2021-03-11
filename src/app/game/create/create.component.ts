import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  createFG : FormGroup = new FormGroup({
    name : new FormControl('', [Validators.required, Validators.maxLength(32)]),
    sexe : new FormControl('masculin'),
    race : new FormControl('human'),
    religion : new FormControl('alzure'),
    clan : new FormControl('clan-1')
  })

  constructor(
    public user : UserService,
    public router : Router
  ) { }

  ngOnInit(): void {

    this.createFG.valueChanges.subscribe( () => {
      console.log(this.createFG.value) ;
    })

  }
  create(){
    console.log(this.createFG.value) ;
    this.user.createChara(this.createFG.value, res => {

      if ( res ){
        this.user.updateChara(res);
        this.router.navigate(['/jeu/personnage']);
      }


    });
  }

}
