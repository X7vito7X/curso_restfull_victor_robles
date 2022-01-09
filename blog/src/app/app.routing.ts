//TODOS IMPORT NECESARIOS
import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

//TODOS IMPORTAR COMPONENTES
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { ErrorComponent } from "./components/error/error.component";
import { IndexComponent } from "./components/index/index.component";
import { UserEditComponent } from "./components/user-edit/user-edit.component";
import { CategoryNewComponent } from "./components/category-new/category-new.component";
import { PostNewComponent } from "./components/post-new/post-new.component";
import { PostDetailComponent } from "./components/post-detail/post-detail.component";
import { PostEditComponent } from "./components/post-edit/post-edit.component";
import { CategoryDetailComponent } from "./components/category-detail/category-detail.component";

import { IdentityGuard } from "./services/identity.guard";
import { ProfileComponent } from "./components/profile/profile.component";
//TODOS DEFINIR LAS RUTAS
const appRoutes: Routes = [

  {path: '',component: IndexComponent},
  {path: 'inicio',component: IndexComponent},
  {path: 'login',component: LoginComponent},
  {path: 'logout/:sure',component: LoginComponent},
  {path: 'register',component: RegisterComponent},
  {path: 'ajustes',component: UserEditComponent,canActivate:[IdentityGuard]},
  {path: 'crear-categoria',component: CategoryNewComponent,canActivate:[IdentityGuard]},
  {path: 'crear-entrada',component: PostNewComponent,canActivate:[IdentityGuard]},
  {path: 'entrada/:id',component: PostDetailComponent},
  {path: 'editar-entrada/:id',component: PostEditComponent,canActivate:[IdentityGuard]},
  {path: 'categoria/:id',component: CategoryDetailComponent},
  {path: 'perfil/:id',component: ProfileComponent},
  {path: '**',component: ErrorComponent}
];

//TODOS EXPORTAR LAS RUTAS
export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);

