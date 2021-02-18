import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path : 'jeu',
    loadChildren : () => import('./game/game.module').then(m=>m.GameModule)
  },
  {
    path : 'connexion',
    loadChildren : () => import('./connexion/connexion.module').then(m=>m.ConnexionModule)
  },
  {
    path : '**',
    redirectTo : 'connexion'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
