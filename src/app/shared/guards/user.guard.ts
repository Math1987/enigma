import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(
    private router : Router,
    private user : UserService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

      console.log('guard map called');
      if ( this.user.user ){
        return true ;
      }else if ( localStorage.getItem('token') ){

        return this.user.subject.pipe( map(user => {
          console.log(user);
          if ( !user ){
            this.router.navigate(['/connexion']);
          }
          return true ;
        }));

      }else{
        this.router.navigate(['/connexion']);
        return true ;
      }


    }
}
