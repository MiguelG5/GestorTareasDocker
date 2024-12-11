import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { UserResponse } from 'src/app/models/Login.model';
import { LoginService } from 'src/app/services/login.service';
import { ProyectoService } from 'src/app/services/proyecto.service';
import { NgForm } from '@angular/forms';
import { ActividadesService } from 'src/app/services/actividades.service'; 
import { Actividad } from 'src/app/models/actividad'; 
import { Proyecto } from 'src/app/models/proyecto';
import { ColaboradorService } from 'src/app/services/colaboradores.service'; // Importa el servicio de colaboradores
import { Colaborador } from 'src/app/models/colaboradores'; // Importa el modelo de colaboradores

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {
  breadcrumbs = [
    { label: 'Inicio', url: '' },
    { label: 'Proyectos', url: 'proyectos' },
  ];
  breadcrumbs1 = [
    { label: 'Inicio' },
    { label: 'Proyectos' },
    { label: 'Actividades', url: 'actividades' }
  ];
  user: UserResponse | null = null;
  proyectosDelUsuario: Proyecto[] = [];
  selectedProjectId: number | null = null; // Variable para almacenar el ID del proyecto seleccionado
  actividadesDelProyecto: Actividad[] = []; // Variable para almacenar las actividades del proyecto seleccionado
  colaboradoresDelUsuario: Colaborador[] = [];
  selectedColaboradores: number[] = []; // Almacena los IDs de los colaboradores seleccionados

  constructor(
    public proyectoService: ProyectoService,
    public actividadesService: ActividadesService,
    private colaboradorService: ColaboradorService, // Inyecta el servicio de colaboradores
    private loginService: LoginService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    const usuarioString = localStorage.getItem('usuario');
    if (usuarioString !== null) {
      this.user = JSON.parse(usuarioString);
      if (this.user !== null) {
        this.getProyectoByUser(this.user.id);
        this.getColaboradoresByUser(this.user.id); // Carga los colaboradores del usuario logueado
      }
    } else {
      console.error('No se encontró el usuario en el localStorage.');
    }
  }
  
  suscribirse(actividad: Actividad) {
    this.router.navigate(['/enrolamiento'], { state: { actividad, proyectoId: this.selectedProjectId } });
  }  

  getColaboradoresByUser(user_id: number) {
    this.colaboradorService.getColaboradoresByUser(user_id).subscribe(
      (res) => {
        console.log('Colaboradores recibidos:', res); // Log para verificar datos recibidos
        this.colaboradoresDelUsuario = res;
      },
      (err) => console.error(err)
    );
  }

  getProyectoByUser(user_id: number) {
    this.proyectoService.getProyectoByUser(user_id).subscribe(
      (res) => {
        this.proyectosDelUsuario = res;
      },
      (err) => console.error(err)
    );
  }

  getActividadesByProyecto(proyecto_id: number) {
    this.selectedProjectId = proyecto_id; // Almacena el ID del proyecto seleccionado
    this.actividadesService.getActividadByProyecto(proyecto_id).subscribe(
      (res) => {
        this.actividadesDelProyecto = res.filter(actividad => actividad.proyecto_id === proyecto_id);
      },
      (err) => console.error(err)
    );
  }
  


  addProyecto(form: NgForm) {
    const idUsuario = this.user?.id;
    if (idUsuario !== undefined && idUsuario !== null) {
      form.value.user_id = idUsuario;
      
      if (form.value.id) {
        this.proyectoService.putProyecto(form.value).subscribe(
          (res) => {
            this.getProyectoByUser(idUsuario);
            form.reset();
          },
          (err) => console.error(err)
        );
      } else {
        this.proyectoService.createProyecto(form.value).subscribe(
          (res) => {
            this.getProyectoByUser(idUsuario);
            form.reset();
          },
          (err) => console.error(err)
        );
      }
    } else {
      console.error('No se encontró el usuario en el localStorage o el ID de usuario es inválido.');
    }
  }

  deleteProyecto(id: number) {
    if (confirm('¿Estás seguro de querer eliminar tu proyecto?')) {
      const idUsuario = this.user?.id;
      if (idUsuario !== undefined && idUsuario !== null) {
        this.proyectoService.deleteProyecto(id).subscribe(
          (res) => {
            this.getProyectoByUser(idUsuario);
          },
          (err) => console.error(err)
        );
      } else {
        console.error('No se encontró el usuario en el localStorage o el ID de usuario es inválido.');
      }
    }
  }

  editProyecto(proyecto: Proyecto) {
    this.proyectoService.selectedProyecto = proyecto;
  }

  resetForm(form: NgForm) {
    form.reset();
  }

  // ACTIVIDADES

  getActividad() {
    this.actividadesService.getActividad().subscribe(
      (res) => {
        this.actividadesService.actividad = res;
      },
      (err) => console.error(err)
    );
  }

  addActividad(form: NgForm) {
    const idUsuario = this.user?.id;
    if (idUsuario) {
      form.value.user_id = idUsuario;
      form.value.proyecto_id = this.actividadesService.selectedAtividad.proyecto_id;
      
      const actividad = form.value;
      actividad.colaboradores = this.selectedColaboradores; // Añade los colaboradores seleccionados

      if (actividad.id) {
        this.actividadesService.putActividad(actividad).subscribe(
          (res) => {
            this.getActividadesByProyecto(this.actividadesService.selectedAtividad.proyecto_id);
            form.reset();
            this.selectedColaboradores = []; // Resetea los colaboradores seleccionados
          },
          (err) => console.error(err)
        );
      } else {
        this.actividadesService.createActividad(actividad).subscribe(
          (res) => {
            this.getActividadesByProyecto(this.actividadesService.selectedAtividad.proyecto_id);
            form.reset();
            this.selectedColaboradores = []; // Resetea los colaboradores seleccionados
          },
          (err) => console.error(err)
        );
      }
    } else {
      console.error('No se encontró el usuario en el localStorage o el ID de usuario es inválido.');
    }
  }


  prepareNewActivity(proyectoId: number) {
    this.actividadesService.selectedAtividad = {
      id: 0,
      proyecto_id: proyectoId, // Asigna el ID del proyecto
      nombre_actividad: '',
      descripcion: '',
      fecha_creacion: '',
      fecha_finalizacion: ''
    };
    this.selectedColaboradores = []; // Resetea los colaboradores seleccionados al preparar una nueva actividad
  }

  deleteActividad(id: number) {
    if (confirm('¿Estás seguro de querer eliminar tu ACTIVIDAD?')) {
      this.actividadesService.deleteActividad(id).subscribe(
        (res) => {
          if (this.selectedProjectId) {
            this.getActividadesByProyecto(this.selectedProjectId); 
          }
        },
        (err) => console.error(err)
      );
    }
  }
  

  editActividad(actividad: Actividad) {
    this.actividadesService.selectedAtividad = actividad;
  }
}
