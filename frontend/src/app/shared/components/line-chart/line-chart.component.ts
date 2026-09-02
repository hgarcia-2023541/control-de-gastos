import { CommonModule } from "@angular/common";
import { Component, Input, computed, signal } from "@angular/core";
import { PuntoSerieMensual } from "../../models/dashboard.model";

@Component({
  selector: "app-line-chart",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./line-chart.component.html",
  styleUrl: "./line-chart.component.css",
})
export class LineChartComponent {
  private datosInternos = signal<PuntoSerieMensual[]>([]);

  @Input() set datos(valor: PuntoSerieMensual[] | null) {
    this.datosInternos.set(valor ?? []);
  }

  // Dimensiones internas del SVG (viewBox); el elemento se escala
  // luego con CSS para ser responsivo.
  readonly ancho = 480;
  readonly alto = 220;
  private readonly padding = { top: 10, right: 10, bottom: 22, left: 28 };

  private maxValor = computed(() => {
    const puntos = this.datosInternos();
    if (!puntos.length) return 10;
    const max = Math.max(...puntos.map((p) => Math.max(p.ingresos, p.gastos)));
    // redondeamos hacia arriba a un múltiplo de 10 para que el eje se vea limpio
    return Math.ceil((max || 10) / 10) * 10;
  });

  etiquetas = computed(() => this.datosInternos().map((p) => p.etiqueta));

  private escalarX(indice: number): number {
    const puntos = this.datosInternos();
    const anchoUtil = this.ancho - this.padding.left - this.padding.right;
    if (puntos.length <= 1) return this.padding.left;
    return this.padding.left + (indice / (puntos.length - 1)) * anchoUtil;
  }

  private escalarY(valor: number): number {
    const altoUtil = this.alto - this.padding.top - this.padding.bottom;
    const proporcion = valor / this.maxValor();
    return this.padding.top + altoUtil - proporcion * altoUtil;
  }

  lineaIngresos = computed(() => this.construirLinea("ingresos"));
  areaIngresos = computed(() => this.construirArea("ingresos"));
  lineaGastos = computed(() => this.construirLinea("gastos"));
  areaGastos = computed(() => this.construirArea("gastos"));

  private construirLinea(campo: "ingresos" | "gastos"): string {
    const puntos = this.datosInternos();
    if (!puntos.length) return "";
    return puntos
      .map((p, i) => `${i === 0 ? "M" : "L"} ${this.escalarX(i)} ${this.escalarY(p[campo])}`)
      .join(" ");
  }

  private construirArea(campo: "ingresos" | "gastos"): string {
    const puntos = this.datosInternos();
    if (!puntos.length) return "";
    const base = this.alto - this.padding.bottom;
    const linea = this.construirLinea(campo);
    const ultimoX = this.escalarX(puntos.length - 1);
    const primerX = this.escalarX(0);
    return `${linea} L ${ultimoX} ${base} L ${primerX} ${base} Z`;
  }

  lineasGuia = computed(() => {
    const max = this.maxValor();
    const pasos = 4;
    const valores: number[] = [];
    for (let i = 0; i <= pasos; i++) {
      valores.push(Math.round((max / pasos) * i));
    }
    return valores.map((valor) => ({ valor, y: this.escalarY(valor) }));
  });

  posicionEtiquetaX(indice: number): number {
    return this.escalarX(indice);
  }
}
