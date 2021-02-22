import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {

  createFG : FormGroup ;
  loginFG : FormGroup ;

  constructor(
    public user : UserService,
    public router : Router
  ) { 


    const conf = ( ): ValidationErrors | null => {
      if ( this && this.createFG && this.createFG && this.createFG.get("password").value === this.createFG.get("confirm").value ){
        if ( !this.createFG.get('password').valid ){
          this.createFG.get('password').updateValueAndValidity();
        }
        if ( !this.createFG.get('confirm').valid ){
          this.createFG.get('confirm').updateValueAndValidity();
        }
        return null ;
      }else{
        return {nomatch : true} ;
      }
    }


    this.createFG = new FormGroup({
      name : new FormControl('', [Validators.required]),
      email : new FormControl('', [Validators.required, Validators.email]),
      password : new FormControl('', [Validators.required, Validators.minLength(4), conf]),
      confirm : new FormControl('', [Validators.required, conf])
    });
  
    this.loginFG = new FormGroup({
      email : new FormControl('', [Validators.required, Validators.email]),
      password : new FormControl('', [Validators.required, Validators.minLength(4)]),
    });
  


  }

  confirmPassword( grou: AbstractControl): ValidationErrors | null {
    if ( this && this.createFG && this.createFG && this.createFG.get("password").value === this.createFG.get("confirm").value ){
      return null 
    }else{
      return {nomatch : true} ;
    }
  }

  ngOnInit(): void {


  }
  create(){
    this.user.createNew(this.createFG.value, res => {

      console.log("user created", res);

      if ( res ){
        this.router.navigate(['/jeu/creer']);
      }else{
        alert('une erreur est survenue lors de la création du compte.')
      }

    });
  }
  login(){
    this.user.login(this.loginFG.value, res => {

      if ( res ){
        console.log('login', res );
        this.user.updateUser(res);
        this.router.navigate(['/jeu/personnage']);
      }else{
        alert('impossible de se connecter.')
      }

    });
  }

}
