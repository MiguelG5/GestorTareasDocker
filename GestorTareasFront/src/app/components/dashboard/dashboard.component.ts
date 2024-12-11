import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { PagoService } from 'src/app/services/pagos.service';
import { PaqueteService } from 'src/app/services/paquetes.service';
import { ColaboradorService } from 'src/app/services/colaboradores.service';
import { ProyectoService } from 'src/app/services/proyecto.service';
import { User } from 'src/app/models/Login.model';
import { Pago } from 'src/app/models/pago';
import { Paquete } from 'src/app/models/paquetes';
import { Colaborador } from 'src/app/models/colaboradores';
import { Proyecto } from 'src/app/models/proyecto';
import { Actividad } from 'src/app/models/actividad';
import { ActividadesService } from 'src/app/services/actividades.service';
import { ActividadColaboradorService } from 'src/app/services/actividad-colaborador.service';
import { ActividadColaborador } from 'src/app/models/actividad_colaborador';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  breadcrumbs = [
    { label: 'Inicio', url: '' },
    { label: 'Dashboard', url: '/dashboard' },
  ];
  users: User[] = [];
  pagos: Pago[] = [];
  paquetes: Paquete[] = [];
  colaboradores: Colaborador[] = [];
  proyectos: Proyecto[] = [];
  actividades: Actividad[] = [];
  actividadColaboradores: ActividadColaborador[] = [];

  constructor(
    private loginService: LoginService, 
    private pagoService: PagoService, 
    private paqueteService: PaqueteService,
    private colaboradorService: ColaboradorService,
    private proyectoService: ProyectoService,
    private actividadesService: ActividadesService,
    private actividadColaboradorService: ActividadColaboradorService
  ) {}

  ngOnInit(): void {
    this.loginService.getAllUsers().subscribe(
      (response) => {
        this.users = response.users;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );

    this.pagoService.getPagos().subscribe(
      (response) => {
        this.pagos = response;
      },
      (error) => {
        console.error('Error fetching pagos:', error);
      }
    );

    this.paqueteService.getPaquetes().subscribe(
      (response) => {
        this.paquetes = response;
      },
      (error) => {
        console.error('Error fetching paquetes:', error);
      }
    );

    this.colaboradorService.getColaboradores().subscribe(
      (response) => {
        this.colaboradores = response;
      },
      (error) => {
        console.error('Error fetching colaboradores:', error);
      }
    );

    this.proyectoService.getProyecto().subscribe(
      (response) => {
        this.proyectos = response;
      },
      (error) => {
        console.error('Error fetching proyectos:', error);
      }
    );

    this.actividadesService.getActividades().subscribe(
      (response) => {
        this.actividades = response;
      },
      (error) => {
        console.error('Error fetching actividades:', error);
      }
    );
    this.actividadColaboradorService.getEnrolamientos().subscribe(
      (response) => {
        this.actividadColaboradores = response;
      },
      (error) => {
        console.error('Error fetching actividad_colaborador:', error);
      }
    );
  }
}
