import { Injectable, inject } from "@angular/core";
import { Observable, of, map } from "rxjs";
import { delay } from "rxjs/operators";
import {
  CategoriaGasto,
  GastoReciente,
  PuntoSerieMensual,
  ResumenFinanciero,
} from "../../shared/models/dashboard.model";
import { IngresosService } from "./ingresos.service";
import { Ingreso } from "../../shared/models/ingreso.model";
import { fechaEnPeriodo } from "../../shared/utils/periodo.util";

// Los GASTOS siguen siendo datos de demostración (el backend todavía
// no tiene el módulo "expenses" implementado, ver
// backend/src/modules/expenses/, aún vacío). Los INGRESOS ya son
// reales: vienen de PostgreSQL a través de IngresosService, filtrados
// por el usuario autenticado.
//
// Cuando el módulo de expenses exista, solo hay que repetir aquí el
// mismo patrón que ya se usa para ingresos (inyectar un GastosService
// real y dejar de usar estas constantes).
const GASTOS_DEMO_TOTAL = 2350;

// misma "curva" que antes, pero ahora es la parte de GASTOS únicamente;
// la parte de INGRESOS de cada punto se calcula con datos reales.
const GASTOS_DEMO_POR_DIA: Record<string, number> = {
  "1": 1, "3": 6, "5": 9, "7": 15, "9": 17, "11": 16,
  "13": 20, "15": 18, "17": 21, "19": 19, "21": 22, "23": 24,
};

const CATEGORIAS_GASTO_DEMO: CategoriaGasto[] = [
  { nombre: "Alimentación", porcentaje: 35, color: "#1f3327" },
  { nombre: "Transporte", porcentaje: 25, color: "#8b7355" },
  { nombre: "Entretenimiento", porcentaje: 15, color: "#c4a882" },
  { nombre: "Hogar", porcentaje: 15, color: "#6f8f74" },
  { nombre: "Educación", porcentaje: 8, color: "#a05a3a" },
  { nombre: "Otros", porcentaje: 2, color: "#d9c9b8" },
];

const GASTOS_RECIENTES_DEMO: GastoReciente[] = [
  { id: 1, descripcion: "Almuerzo", categoria: "Alimentación", icono: "🍽️", fecha: "2026-08-18", monto: 35 },
  { id: 2, descripcion: "Transporte", categoria: "Transporte", icono: "🚗", fecha: "2026-08-17", monto: 15 },
  { id: 3, descripcion: "Compra de cuaderno", categoria: "Educación", icono: "🎓", fecha: "2026-08-15", monto: 25 },
  { id: 4, descripcion: "Videojuego", categoria: "Entretenimiento", icono: "🎮", fecha: "2026-08-14", monto: 50 },
  { id: 5, descripcion: "Supermercado", categoria: "Hogar", icono: "🏠", fecha: "2026-08-12", monto: 180 },
];

@Injectable({ providedIn: "root" })
export class DashboardService {
  private ingresosService = inject(IngresosService);
  private readonly LATENCIA_DEMO = 150;

  // Ingresos = reales (PostgreSQL, filtrados al período). Gastos = demo.
  obtenerResumen(periodo: string): Observable<ResumenFinanciero> {
    return this.ingresosService.obtenerIngresos().pipe(
      map((ingresos) => ({
        ingresos: this.sumarIngresosDelPeriodo(ingresos, periodo),
        gastos: GASTOS_DEMO_TOTAL,
      }))
    );
  }

  obtenerSerieMensual(_periodo: string): Observable<PuntoSerieMensual[]> {
    return this.ingresosService.obtenerIngresos().pipe(
      map((ingresos) => {
        const dias = Object.keys(GASTOS_DEMO_POR_DIA).map((d) => parseInt(d, 10));
        return dias.map((dia) => ({
          etiqueta: String(dia),
          // suma acumulada de ingresos reales hasta ese día del mes
          ingresos: ingresos
            .filter((i) => new Date(i.fecha + "T00:00:00").getDate() <= dia)
            .reduce((suma, i) => suma + i.monto, 0),
          gastos: GASTOS_DEMO_POR_DIA[String(dia)],
        }));
      })
    );
  }

  // Se mantiene 100% de demostración: todavía no se implementa la
  // parte real de gastos (ver punto 17/28 del encargo de Ingresos).
  obtenerGastosPorCategoria(_periodo: string): Observable<CategoriaGasto[]> {
    return of(CATEGORIAS_GASTO_DEMO).pipe(delay(this.LATENCIA_DEMO));
  }

  obtenerUltimosGastos(_periodo: string): Observable<GastoReciente[]> {
    const ordenados = [...GASTOS_RECIENTES_DEMO].sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );
    return of(ordenados).pipe(delay(this.LATENCIA_DEMO));
  }

  private sumarIngresosDelPeriodo(ingresos: Ingreso[], periodo: string): number {
    return ingresos
      .filter((i) => fechaEnPeriodo(i.fecha, periodo))
      .reduce((suma, i) => suma + i.monto, 0);
  }
}
