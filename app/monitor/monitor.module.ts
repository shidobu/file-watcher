import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { MonitorComponent } from "./monitor.component";
import { LogItemComponent } from "./log-item.component";

import { DirectoryService } from '../services/directory.service';
import { WatcherService } from '../services/watcher.service';
import { LogService } from '../services/log.service';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        HttpModule,
        FormsModule
    ],
    declarations: [
        MonitorComponent,
        LogItemComponent
    ],
    providers: [
        LogService,
        WatcherService,
        DirectoryService
    ],
    entryComponents: [
    ],
    exports: [
        MonitorComponent
    ]
})
export class MonitorModule { }