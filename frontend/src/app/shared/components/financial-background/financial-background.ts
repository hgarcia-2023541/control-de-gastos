import {
  AfterViewInit,
  Component,
  OnDestroy,
} from '@angular/core';

import gsap from 'gsap';

@Component({
  selector: 'app-financial-background',
  imports: [],
  templateUrl: './financial-background.html',
  styleUrl: './financial-background.css',
})
export class FinancialBackground implements AfterViewInit, OnDestroy {

  private animations: gsap.core.Tween[] = [];

  ngAfterViewInit(): void {
    this.iniciarAnimaciones();
  }

  private iniciarAnimaciones(): void {
    const monedas = document.querySelectorAll(
      '.financial-background .moneda'
    );

    monedas.forEach((moneda, index) => {

      const duracion = 3.5 + Math.random() * 2;
      const desplazamiento = 10 + Math.random() * 12;

      const animation = gsap.to(moneda, {
        y: -desplazamiento,
        rotation: index % 2 === 0 ? 8 : -8,
        duration: duracion,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: Math.random() * 1.5,
      });

      this.animations.push(animation);
    });
  }

  ngOnDestroy(): void {
    this.animations.forEach((animation) => animation.kill());
  }
}