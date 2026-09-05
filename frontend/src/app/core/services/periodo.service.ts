// src/app/core/services/periodo.service.ts
import { Injectable, signal } from '@angular/core';
import { periodoActual } from '../../shared/utils/periodo.util';

@Injectable({
providedIn: 'root'
})
export class PeriodoService {
  // Estado privado
private periodoActualSignal = signal(periodoActual());

  // Exponer solo lectura (para que otros componentes no lo modifiquen directamente)
readonly periodo = this.periodoActualSignal.asReadonly();

  // Método para cambiar el período (pueden llamarlo todos los componentes)
setPeriodo(nuevoPeriodo: string): void {
    this.periodoActualSignal.set(nuevoPeriodo);
}

  // Obtener el valor actual (por si lo necesitas en algún método)
getPeriodo(): string {
    return this.periodoActualSignal();
}
}