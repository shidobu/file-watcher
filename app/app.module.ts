import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { WindowComponent } from './window.component';
import { OptionsModule } from "./options/options.module";
import { MonitorModule } from "./monitor/monitor.module";

import { DirectoryService } from './services/directory.service';
import { WatcherService } from './services/watcher.service';
import { LogService } from './services/log.service';
import { WatcherComponent } from './watcher.component';
import { PageLayoutComponent } from './page-layout.component';
import { ColumnComponent } from './column.component';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        HttpModule,
        FormsModule,
        OptionsModule,
        MonitorModule
    ],
    declarations: [
        WindowComponent,
        WatcherComponent,
        PageLayoutComponent,
        ColumnComponent
    ],
    providers: [
        LogService,
        WatcherService,
        DirectoryService
    ],
    entryComponents: [
    ],
    bootstrap: [WindowComponent]
})
export class AppModule { }