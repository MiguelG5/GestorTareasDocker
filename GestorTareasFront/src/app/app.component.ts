import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isScrolled: boolean = false;
  tiempoInicioSesion: number = 0;
  tiempoAlerta: number = 60 * 1000;
  tiempoRespuesta: number = 60 * 1000;
  alertaMostrada: boolean = false;
  tiempoCierre: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // this.iniciarAlerta();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.pageYOffset > 100) {
      this.isScrolled = true;
    } else {
      this.isScrolled = false;
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  mostrarAlerta() {
    let tiempoActual = Date.now();
    let tiempoTranscurrido = tiempoActual - this.tiempoInicioSesion;
    if (!this.alertaMostrada && tiempoTranscurrido >= this.tiempoAlerta) {
      this.alertaMostrada = true;
      let confirmacion = confirm('¿Quieres cerrar sesión?');
      if (confirmacion) {
        this.logout();
      } else {
        this.tiempoCierre = setTimeout(() => {
          this.logout();
        }, this.tiempoRespuesta);
      }
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['']).then(() => {
      window.location.reload();
    });
  }

  iniciarSesion() {
    this.tiempoInicioSesion = Date.now();
    this.alertaMostrada = false;
    clearTimeout(this.tiempoCierre);
    this.tiempoCierre = setTimeout(() => {
      this.logout();
    }, this.tiempoRespuesta);
  }

  iniciarAlerta() {
    setInterval(() => this.mostrarAlerta(), 1000);
  }
}
