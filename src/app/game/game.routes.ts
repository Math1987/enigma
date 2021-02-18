
import { Route, RouterModule } from "@angular/router";
import { CarteComponent } from "./carte/carte.component";
import { HistoricComponent } from "./carte/historic/historic.component";
import { InfoCaseComponent } from "./carte/info-case/info-case.component";
import { CharacterComponent } from "./character/character.component";
import { CreateComponent } from "./create/create.component";
import { GameComponent } from "./game.component";
import { PantheonComponent } from "./pantheon/pantheon.component";

const routes: Route[] = [
    {
      path: '',
      component: GameComponent,
      children : [
        {
          path : 'creer',
          loadChildren : () => import('./create/create.module').then(m=>m.CreateModule)
        },
        {
          path : 'carte',
          component : CarteComponent,
          children : [
            {
              path : 'action',
              component : InfoCaseComponent
            },
            {
              path : 'historique',
              component : HistoricComponent
            },
            {
              path : '**', 
              redirectTo : 'action' 
            }
          ]
        },
        {
          path : 'personnage',
          component : CharacterComponent
        },
        {
          path : 'pantheon',
          component : PantheonComponent
        },
        {
          path : '**',
          redirectTo : 'carte'
        }
      ]
    }
  ];

export const GameRouting = RouterModule.forChild(routes) ;