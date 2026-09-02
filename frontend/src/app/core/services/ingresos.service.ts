import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "../../../environments/environment";
import { ApiResponse } from "../models/api-response.model";
import { FiltrosIngreso, Ingreso, IngresoFormulario } from "../../shared/models/ingreso.model";

@Injectable({ providedIn: "root" })
export class IngresosService {
  private readonly baseUrl = `${environment.apiUrl}/ingresos`;

  constructor(private http: HttpClient) {}

  // El token se adjunta automáticamente por el authInterceptor, así
  // que el backend siempre sabe de qué usuario son estos ingresos.
  obtenerIngresos(filtros: FiltrosIngreso = {}): Observable<Ingreso[]> {
    let params = new HttpParams();
    if (filtros.busqueda) params = params.set("busqueda", filtros.busqueda);
    if (filtros.fechaInicio) params = params.set("fechaInicio", filtros.fechaInicio);
    if (filtros.fechaFin) params = params.set("fechaFin", filtros.fechaFin);
    if (filtros.categoria) params = params.set("categoria", filtros.categoria);

    return this.http
      .get<ApiResponse<Ingreso[]>>(this.baseUrl, { params })
      .pipe(map((res) => this.normalizarLista(res.data ?? [])));
  }

  crearIngreso(datos: IngresoFormulario): Observable<Ingreso> {
    return this.http
      .post<ApiResponse<Ingreso>>(this.baseUrl, datos)
      .pipe(map((res) => this.normalizar(res.data!)));
  }

  actualizarIngreso(id: number, datos: IngresoFormulario): Observable<Ingreso> {
    return this.http
      .put<ApiResponse<Ingreso>>(`${this.baseUrl}/${id}`, datos)
      .pipe(map((res) => this.normalizar(res.data!)));
  }

  eliminarIngreso(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`).pipe(map(() => undefined));
  }

  // El backend devuelve "monto" como string (tipo NUMERIC de
  // PostgreSQL) y "fecha" como ISO completo; los normalizamos a
  // number/"yyyy-mm-dd" para que el resto del frontend no tenga que
  // preocuparse por eso.
  private normalizar(ingreso: Ingreso): Ingreso {
    return {
      ...ingreso,
      monto: Number(ingreso.monto),
      fecha: String(ingreso.fecha).slice(0, 10),
    };
  }

  private normalizarLista(ingresos: Ingreso[]): Ingreso[] {
    return ingresos.map((i) => this.normalizar(i));
  }
}
