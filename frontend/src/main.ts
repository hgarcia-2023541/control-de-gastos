// Importante: esta línea debe ser la primera de todo el archivo.
// zone.js parcha funciones globales (setTimeout, Promise, XMLHttpRequest)
// para que Angular sepa cuándo terminó algo asíncrono (como una petición
// HTTP) y actualice la pantalla automáticamente.
import "zone.js";

import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { appConfig } from "./app/app.config";

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
