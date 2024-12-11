import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ActividadColaborador } from "../models/actividad_colaborador";

@Injectable({
  providedIn: "root",
})
export class ActividadColaboradorService {
  private URL_API = "http://localhost:3100/api/actividad_colaborador";

  constructor(private http: HttpClient) {}

  getEnrolamientos(): Observable<ActividadColaborador[]> {
    return this.http.get<ActividadColaborador[]>(this.URL_API);
  }

  getEnrolamientosByActividad(
    actividad_id: number
  ): Observable<ActividadColaborador[]> {
    return this.http.get<ActividadColaborador[]>(
      `${this.URL_API}/actividad/${actividad_id}`
    );
  }

  getEnrolamientosByColaborador(
    colaborador_id: number
  ): Observable<ActividadColaborador[]> {
    return this.http.get<ActividadColaborador[]>(
      `${this.URL_API}/colaborador/${colaborador_id}`
    );
  }

  enrolarColaboradoresEnActividad(
    actividad_id: number,
    colaborador_ids: number[]
  ): Observable<void> {
    return this.http.post<void>(`${this.URL_API}/enrolar`, {
      actividad_id,
      colaboradores: colaborador_ids,
    });
  }

  eliminarColaboradorDeActividad(
    actividad_id: number,
    colaborador_id: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.URL_API}/eliminar/${actividad_id}/${colaborador_id}`
    );
  }
}
