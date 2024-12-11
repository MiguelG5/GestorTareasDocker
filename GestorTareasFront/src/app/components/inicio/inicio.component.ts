import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaqueteService } from 'src/app/services/paquetes.service';
import { Paquete } from 'src/app/models/paquetes';
import { UserResponse } from 'src/app/models/Login.model';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  breadcrumbs = [
    { label: 'Inicio', url: '/' }
  ];

  user: UserResponse | null = null;

  constructor(private router: Router, public paqueteServices: PaqueteService) { }

  ngOnInit(): void {
    const userLoggedIn = localStorage.getItem('usuario');
    if (userLoggedIn) {
      this.user = JSON.parse(userLoggedIn);
      this.startSessionTimer();
    }
    this.getPaquetes();
  }

  getPaquetes() {
    this.paqueteServices.getPaquetes().subscribe(
      (res) => {
        this.paqueteServices.paquetes = res;
      },
      (err) => console.error(err)
    );
  }

  suscribirse(paquete: Paquete) {
    this.router.navigate(['/pagos'], { state: { paquete } });
  }

  startSessionTimer() {
    setTimeout(() => {
      const confirmLogout = confirm('¿Desea continuar con la sesión?');
      if (confirmLogout) {
        console.log('Continuar con la sesión');
      } else {
        console.log('Cerrar la sesión');
        this.logout();
      }
    }, .2 * 60 * 1000); // 5 minutos en milisegundos
  }

  logout() {
    console.log('Logout realizado');
    localStorage.clear();
    window.location.reload();
  }

  isUser(): boolean {
    return this.user?.role === 'user';
  }
  isNotLoggedIn(): boolean {
    return this.user === null;
  }
}
