import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Proyecto } from "../models/proyecto";

@Injectable({
  providedIn: "root",
})
export class ProyectoService {
  selectedProyecto: Proyecto = {
    id: 0,
    user_id: 0,
    nombre_del_proyecto: "",
    descripcion: "",
    fecha_creacion: new Date(),
    fecha_finalizacion: new Date(),
  };

  private URL_API = "http://localhost:3100/api/proyectos";

  proyecto: Proyecto[] = [];

  constructor(private http: HttpClient) {}

  getProyecto() {
    return this.http.get<Proyecto[]>(this.URL_API);
  }

  createProyecto(proyecto: Proyecto) {
    return this.http.post(this.URL_API, proyecto);
  }

  putProyecto(proyecto: Proyecto) {
    return this.http.put(`${this.URL_API}/${proyecto.id}`, proyecto);
  }

  deleteProyecto(id: number) {
    return this.http.delete(`${this.URL_API}/${id}`);
  }

  getProyectoByUser(user_id: number) {
    return this.http.get<Proyecto[]>(`${this.URL_API}/user/${user_id}`);
  }
}
