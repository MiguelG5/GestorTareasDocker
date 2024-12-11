import { Component, OnInit } from "@angular/core";
import { ActividadesService } from "src/app/services/actividades.service";
import { ActividadColaboradorService } from "src/app/services/actividad-colaborador.service";
import { Actividad } from "src/app/models/actividad";
import { ActividadColaborador } from "src/app/models/actividad_colaborador";
import { UserResponse } from "src/app/models/Login.model";

@Component({
  selector: "app-actividades",
  templateUrl: "./actividades.component.html",
  styleUrls: ["./actividades.component.css"],
})
export class ActividadesComponent implements OnInit {
  actividades: Actividad[] = [];
  user: UserResponse | null = null;

  constructor(
    private actividadesService: ActividadesService,
    private actividadColaboradorService: ActividadColaboradorService
  ) {}

  ngOnInit() {
    // Obtener el usuario del localStorage
    const user = JSON.parse(localStorage.getItem("usuario") || "{}");
    console.log("Parsed user:", user);

    const id_colaborador = user?.id_colaborador;
    if (id_colaborador) {
      console.log(
        "Obteniendo actividades para id_colaborador:",
        id_colaborador
      );
      this.getActividadesByColaborador(id_colaborador);
    } else {
      console.log("El usuario no tiene un id_colaborador válido.");
    }
  }

  getActividadesByColaborador(colaboradorId: number) {
    this.actividadColaboradorService
      .getEnrolamientosByColaborador(colaboradorId)
      .subscribe(
        (enrolamientos: ActividadColaborador[]) => {
          if (enrolamientos.length > 0) {
            console.log("Enrolamientos obtenidos:", enrolamientos);
            const actividadIds = enrolamientos.map((e) => e.actividad_id);
            this.getActividadesByIds(actividadIds);
          } else {
            console.log(
              "No hay enrolamientos para el colaborador:",
              colaboradorId
            );
          }
        },
        (err) => console.error("Error al obtener los enrolamientos:", err)
      );
  }

  getActividadesByIds(ids: number[]) {
    this.actividades = []; // Limpia la lista antes de cargar nuevas actividades
    ids.forEach((id) => {
      this.actividadesService.getActividadById(id).subscribe(
        (actividad: Actividad) => {
          console.log("Actividad obtenida:", actividad);
          this.actividades.push(actividad);
        },
        (err) =>
          console.error("Error al obtener actividad con ID", id, ":", err)
      );
    });
  }
}
