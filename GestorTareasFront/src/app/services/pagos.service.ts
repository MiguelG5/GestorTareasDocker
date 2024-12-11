import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Pago } from "../models/pago";

@Injectable({
  providedIn: "root",
})
export class PagoService {
  selectedPago: Pago = {
    id: 0,
    user_id: 0,
    paquete_id: 0,
    fecha_inicio: "",
    fecha_finalizacion: "",
  };

  private URL_API = "http://localhost:3100/api/pagos"; // URL del backend

  pagos: Pago[] = [];

  constructor(private http: HttpClient) {}

  getPagos(): Observable<Pago[]> {
    return this.http.get<Pago[]>(this.URL_API);
  }

  getPago(id: number): Observable<Pago> {
    return this.http.get<Pago>(`${this.URL_API}/${id}`);
  }

  createPago(pago: Pago): Observable<Pago> {
    return this.http.post<Pago>(this.URL_API, pago);
  }

  updatePago(pago: Pago): Observable<Pago> {
    return this.http.put<Pago>(`${this.URL_API}/${pago.id}`, pago);
  }

  deletePago(id: number): Observable<Pago> {
    return this.http.delete<Pago>(`${this.URL_API}/${id}`);
  }

  getPagosByUser(user_id: number): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.URL_API}/user/${user_id}`);
  }
}
