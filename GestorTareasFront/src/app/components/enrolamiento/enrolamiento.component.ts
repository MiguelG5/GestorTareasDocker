import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Actividad } from 'src/app/models/actividad';
import { Colaborador } from 'src/app/models/colaboradores';
import { ColaboradorService } from 'src/app/services/colaboradores.service';
import { ActividadColaboradorService } from 'src/app/services/actividad-colaborador.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-enrolamiento',
  templateUrl: './enrolamiento.component.html',
  styleUrls: ['./enrolamiento.component.css']
})
export class EnrolamientoComponent implements OnInit {
  breadcrumbs = [
    { label: 'Inicio', url: '' },
    { label: 'Enrolamiento', url: '/enrolamiento' },
  ];
  actividad: Actividad | undefined;
  proyectoId: number | undefined;
  colaboradores: Colaborador[] = [];
  colaboradoresEnrolados: Colaborador[] = [];

  constructor(
    private route: ActivatedRoute,
    private colaboradorService: ColaboradorService,
    private actividadColaboradorService: ActividadColaboradorService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    const navigationState = window.history.state;
    this.actividad = navigationState.actividad;
    this.proyectoId = navigationState.proyectoId;

    const userLoggedIn = localStorage.getItem('usuario');
    if (userLoggedIn) {
      const userId = JSON.parse(userLoggedIn).id;

      this.colaboradorService.getColaboradoresByUser(userId).subscribe(
        (colaboradores) => {
          this.colaboradores = colaboradores.map(colaborador => ({ ...colaborador, selected: false }));
          this.filtrarColaboradoresEnrolados();
        },
        (error) => {
          console.error('Error al obtener colaboradores del usuario:', error);
        }
      );
    } else {
      console.error('No se ha encontrado el usuario logueado.');
    }
  }

  filtrarColaboradoresEnrolados(): void {
    if (this.actividad && this.actividad.id) {
      this.actividadColaboradorService.getEnrolamientosByActividad(this.actividad.id).subscribe(
        (enrolamientos) => {
          const colaboradorIds = enrolamientos.map(enrolamiento => enrolamiento.colaborador_id);
          this.colaboradorService.getColaboradoresByIds(colaboradorIds).subscribe(
            (colaboradoresEnrolados) => {
              this.colaboradoresEnrolados = colaboradoresEnrolados;

              // Actualizar la lista de colaboradores disponibles
              this.colaboradorService.getColaboradoresByUser(JSON.parse(localStorage.getItem('usuario')!).id).subscribe(
                (colaboradores) => {
                  this.colaboradores = colaboradores
                    .filter(colaborador => !colaboradorIds.includes(colaborador.id))
                    .map(colaborador => ({ ...colaborador, selected: false }));
                },
                (error) => {
                  console.error('Error al obtener colaboradores del usuario:', error);
                }
              );
            },
            (error) => {
              console.error('Error al obtener detalles de colaboradores enrolados:', error);
            }
          );
        },
        (error) => {
          console.error('Error al obtener enrolamientos por actividad:', error);
        }
      );
    }
  }

  asignarActividad(): void {
    const colaboradoresSeleccionados = this.colaboradores.filter(colaborador => colaborador.selected).map(colaborador => colaborador.id);
    if (colaboradoresSeleccionados.length === 0) {
      alert('Por favor selecciona al menos un colaborador para asignar la actividad.');
      return;
    }

    if (!this.actividad || !this.actividad.id) {
      alert('Error: No se ha podido obtener la información necesaria de la actividad.');
      return;
    }

    this.actividadColaboradorService.enrolarColaboradoresEnActividad(this.actividad.id, colaboradoresSeleccionados)
      .subscribe(
        (response) => {
          console.log('Actividad asignada a colaboradores:', response);
          alert('Actividad asignada correctamente a los colaboradores seleccionados.');
          this.filtrarColaboradoresEnrolados();
        },
        (error) => {
          console.error('Error al asignar actividad a colaboradores:', error);
          alert('Ocurrió un error al asignar la actividad a los colaboradores.');
        }
      );
  }

  eliminarColaborador(colaboradorId: number): void {
    if (!this.actividad || !this.actividad.id) {
      alert('Error: No se ha podido obtener la información necesaria de la actividad.');
      return;
    }

    this.actividadColaboradorService.eliminarColaboradorDeActividad(this.actividad.id, colaboradorId)
      .subscribe(
        response => {
          console.log('Colaborador eliminado de la actividad:', response);
          alert('Colaborador eliminado correctamente de la actividad.');
          this.filtrarColaboradoresEnrolados();
        },
        error => {
          console.error('Error al eliminar colaborador de la actividad:', error);
          alert('Ocurrió un error al eliminar el colaborador de la actividad.');
        }
      );
  }
}
