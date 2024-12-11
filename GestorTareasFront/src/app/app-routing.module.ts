import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { PaginaerrorComponent } from './components/paginaerror/paginaerror.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MapaComponent } from './components/mapa/mapa.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { TerminosComponent } from './components/terminos/terminos.component';
import { ProyectosComponent } from './components/proyectos/proyectos.component';
import { ActividadesComponent } from './components/actividades/actividades.component';
import { PagosComponent } from './components/pagos/pagos.component';
import { EnrolamientoComponent } from './components/enrolamiento/enrolamiento.component';
import { CuentaComponent } from './components/cuenta/cuenta.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'cuenta', component: CuentaComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'actividades', component: ActividadesComponent, canActivate: [AuthGuard] },
  { path: 'proyectos', component: ProyectosComponent, canActivate: [AuthGuard] },
  { path: 'pagos', component: PagosComponent, canActivate: [AuthGuard] },
  { path: 'enrolamiento', component: EnrolamientoComponent},
  { path: 'condiciones', component: TerminosComponent}, 
  { path: 'error', component: PaginaerrorComponent },
  { path: 'login', component: LoginComponent },
  { path: 'resetPassword', component: ResetPasswordComponent },
  { path: 'register', component: RegisterComponent },
//canActivate: [AuthGuard] },
  { path: 'mapa', component: MapaComponent },
  { path: '**', component: PaginaerrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
