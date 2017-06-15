import { Component, Inject, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { LogService, LogEntry, LogType } from './log.service';

@Component({
    moduleId: module.id,
    selector: 'monitor',
    templateUrl: 'monitor.component.html',
    styleUrls: ['monitor.component.css'],
})
export class MonitorComponent implements OnInit {

    private entries: LogEntry[] = [];

    constructor( @Inject(NgZone) private ngZone: NgZone, @Inject(LogService) private logService: LogService) { }

    ngOnInit(): void {
        this.logService.monitor().subscribe(
            (entry: LogEntry) => { this.ngZone.run(() => this.entries.push(entry)); },
            (error?: any) => { this.ngZone.run(() => this.entries.push(error)); });
    }

    clearLog(): void {
        console.log(`Clearing ${this.entries.length} entries.`);
        this.entries = [];
    }
}