
import { Route, RouterModule } from "@angular/router";
import { ConnexionComponent } from "./connexion.component";

const routes : Route[] = [
    {
        path : '',
        component : ConnexionComponent
    }
]

export const ConnexionRoutes = RouterModule.forChild(routes);