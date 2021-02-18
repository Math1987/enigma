import { Route, RouterModule } from '@angular/router';
import { CreateComponent } from './create.component';

const routes: Route[] = [
    {
      path: '',
      component: CreateComponent,
    }
  ];

export const CreateRouting = RouterModule.forChild(routes) ;