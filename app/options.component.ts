import { Component, Inject, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DirectoryService } from './directory.service';
import { WatcherOptions } from './watcher-options';

@Component({
    moduleId: module.id,
    selector: 'options',
    templateUrl: 'options.component.html',
    styleUrls: ['options.component.css'],
})
export class OptionsComponent {

    @Input() private options: WatcherOptions;
    @Output() private optionsChange: EventEmitter<WatcherOptions> = new EventEmitter<WatcherOptions>();

    constructor( @Inject(DirectoryService) private directoryService: DirectoryService) { }

    checkValid(errors: string[]): void {

    }

    updateOptions() {
        this.optionsChange.emit(this.options);
    }
}