import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserResponse } from 'src/app/models/Login.model';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // Verificar si el usuario está autenticado
    const isAuthenticated: UserResponse = JSON.parse(
      localStorage.getItem('usuario')!
    );

    if (isAuthenticated) {
      return true;
    } else {
      // Si no está autenticado, redirigir a la página de inicio de sesión
      Swal.fire({
        title: 'Inicia Sesión',
        text: 'Necesitas iniciar sesión para acceder a está pagina.',
        icon: 'warning',
        timer: 4000,
        backdrop: false,
      }).then(() => {
        this.router.navigate(['/login']);
      });
      return false;
    }
  }
}
