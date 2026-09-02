import { CommonModule } from "@angular/common";
import { Component, Input, computed, signal } from "@angular/core";
import { CategoriaGasto } from "../../models/dashboard.model";

interface SegmentoDona {
  categoria: CategoriaGasto;
  dashArray: string;
  dashOffset: number;
}

interface EtiquetaDona {
  x: number;
  y: number;
  texto: string;
  color: string;
}

@Component({
  selector: "app-donut-chart",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./donut-chart.component.html",
  styleUrl: "./donut-chart.component.css",
})
export class DonutChartComponent {
  private datosInternos = signal<CategoriaGasto[]>([]);

  @Input() set datos(valor: CategoriaGasto[] | null) {
    this.datosInternos.set(valor ?? []);
  }

  readonly centro = 70;
  readonly radio = 60;
  readonly grosor = 22;
  private readonly circunferencia = 2 * Math.PI * this.radio;

  segmentos = computed<SegmentoDona[]>(() => {
    let acumulado = 0;
    return this.datosInternos().map((categoria) => {
      const largo = (categoria.porcentaje / 100) * this.circunferencia;
      const segmento: SegmentoDona = {
        categoria,
        dashArray: `${largo} ${this.circunferencia - largo}`,
        // -90 para empezar arriba (como reloj), y desplazado por lo ya acumulado
        dashOffset: -acumulado,
      };
      acumulado += largo;
      return segmento;
    });
  });

  // Porcentaje escrito directamente sobre cada segmento del anillo,
  // igual que en el diseño de referencia. Se omite en segmentos muy
  // delgados (<5%) porque el texto ya no cabe legible ahí.
  etiquetas = computed<EtiquetaDona[]>(() => {
    let acumuladoPorcentaje = 0;
    const resultado: EtiquetaDona[] = [];

    for (const categoria of this.datosInternos()) {
      const medio = acumuladoPorcentaje + categoria.porcentaje / 2;
      acumuladoPorcentaje += categoria.porcentaje;

      if (categoria.porcentaje < 5) continue;

      const angulo = (medio / 100) * 2 * Math.PI; // 0 = 12 en punto, avanza en sentido horario
      resultado.push({
        x: this.centro + this.radio * Math.sin(angulo),
        y: this.centro - this.radio * Math.cos(angulo),
        texto: `${categoria.porcentaje}%`,
        color: this.colorTextoLegible(categoria.color),
      });
    }

    return resultado;
  });

  // Elige texto claro u oscuro según qué tan oscuro sea el color de
  // fondo del segmento, para que el porcentaje siempre se lea bien.
  private colorTextoLegible(hex: string): string {
    const valor = hex.replace("#", "");
    const r = parseInt(valor.substring(0, 2), 16);
    const g = parseInt(valor.substring(2, 4), 16);
    const b = parseInt(valor.substring(4, 6), 16);
    const luminancia = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminancia < 150 ? "#fcf8f4" : "#2c1810";
  }
}

