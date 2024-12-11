import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Colaborador } from "../models/colaboradores";

@Injectable({
  providedIn: "root",
})
export class ColaboradorService {
  private URL_API = "http://localhost:3100/api/colaboradores"; // Reemplaza con la URL real del backend

  constructor(private http: HttpClient) {}

  getColaboradores(): Observable<Colaborador[]> {
    return this.http.get<Colaborador[]>(this.URL_API);
  }

  getColaboradoresByUser(userId: number): Observable<Colaborador[]> {
    return this.http.get<Colaborador[]>(`${this.URL_API}/user/${userId}`);
  }

  getColaboradoresByIds(colaboradorIds: number[]): Observable<Colaborador[]> {
    // Implementación para obtener colaboradores por IDs
    // Ejemplo hipotético:
    return this.http.post<Colaborador[]>(`${this.URL_API}/details`, {
      ids: colaboradorIds,
    });
  }

  enrolarColaboradorEnProyecto(
    colaboradorId: number,
    proyectoId: number
  ): Observable<any> {
    return this.http.post(`${this.URL_API}/enrolar`, {
      colaborador_id: colaboradorId,
      proyecto_id: proyectoId,
    });
  }

  deleteColaboradorFromProyecto(
    colaboradorId: number,
    proyectoId: number
  ): Observable<any> {
    return this.http.delete(
      `${this.URL_API}/enrolar/${colaboradorId}/${proyectoId}`
    );
  }
  updateColaborador(colaborador: {
    id: number;
    email: string;
    password: string;
  }): Observable<Colaborador> {
    return this.http.put<Colaborador>(`${this.URL_API}/update`, colaborador);
  }
}
