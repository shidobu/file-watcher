import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { WindowComponent } from './window.component';
import { OptionsComponent } from "./options.component";
import { MonitorComponent } from "./monitor.component";
import { FolderInputComponent } from "./folder-input.component";
import { LogItemComponent } from "./log-item.component";

import { DirectoryService } from './directory.service';
import { WatcherService } from './watcher.service';
import { LogService } from './log.service';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        HttpModule,
        FormsModule
    ],
    declarations: [
        WindowComponent,
        OptionsComponent,
        MonitorComponent,
        FolderInputComponent,
        LogItemComponent
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