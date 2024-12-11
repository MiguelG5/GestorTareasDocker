import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Paquete } from "../models/paquetes";

@Injectable({
  providedIn: "root",
})
export class PaqueteService {
  selectedPaquete: Paquete = {
    id: 0,
    nombre_paquete: "",
    descripcion: "",
    costo: 0,
    duracion: 0,
    numero_colaboradores: 0,
  };

  private URL_API = "http://localhost:3100/api/paquetes"; // Reemplazar 'URL_DEL_BACKEND' con la URL real del backend

  paquetes: Paquete[] = [];

  constructor(private http: HttpClient) {}

  getPaquetes() {
    return this.http.get<Paquete[]>(this.URL_API);
  }

  createPaquete(paquete: Paquete) {
    return this.http.post(this.URL_API, paquete);
  }

  updatePaquete(paquete: Paquete) {
    return this.http.put(`${this.URL_API}/${paquete.id}`, paquete);
  }

  deletePaquete(id: number) {
    return this.http.delete(`${this.URL_API}/${id}`);
  }
}
