
import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import { isDev } from "./util";

if (!isDev()) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
