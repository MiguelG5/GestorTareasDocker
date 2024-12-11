import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Actividad } from "../models/actividad";

@Injectable({
  providedIn: "root",
})
export class ActividadesService {
  selectedAtividad: Actividad = {
    id: 0,
    proyecto_id: 0,
    nombre_actividad: "",
    descripcion: "",
    fecha_creacion: "",
    fecha_finalizacion: "",
  };

  private URL_API = "http://localhost:3100/api/actividades";

  actividad: Actividad[] = [];

  constructor(private http: HttpClient) {}

  getActividad() {
    return this.http.get<Actividad[]>(this.URL_API);
  }
  getActividades() {
    return this.http.get<Actividad[]>(this.URL_API);
  }

  createActividad(actividad: Actividad) {
    return this.http.post(this.URL_API, actividad);
  }

  putActividad(actividad: Actividad) {
    return this.http.put(`${this.URL_API}/${actividad.id}`, actividad);
  }

  deleteActividad(id: number) {
    return this.http.delete(`${this.URL_API}/${id}`);
  }

  getActividadByProyecto(proyecto_id: number) {
    return this.http.get<Actividad[]>(
      `${this.URL_API}/proyecto/${proyecto_id}`
    );
  }

  getActividadById(id: number) {
    return this.http.get<Actividad>(`${this.URL_API}/${id}`);
  }
}
