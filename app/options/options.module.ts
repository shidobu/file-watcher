import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { OptionsComponent } from "./options.component";
import { FolderInputComponent } from "./folder-input.component";
import { DropdownEditorComponent } from './dropdown-editor.component';

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
        OptionsComponent,
        FolderInputComponent,
        DropdownEditorComponent
    ],
    providers: [
        DirectoryService,
        LogService,
        WatcherService
    ],
    entryComponents: [
    ],
    exports: [
        OptionsComponent
    ]
})
export class OptionsModule { }