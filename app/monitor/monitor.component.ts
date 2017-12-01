import { Component, Inject, OnInit, Input, Output, EventEmitter, NgZone, ViewChild, ElementRef } from '@angular/core';
import { LogService, LogEntry, LogType } from '../services/log.service';

@Component({
    moduleId: module.id,
    selector: 'monitor',
    templateUrl: 'monitor.component.html',
    styleUrls: ['monitor.component.css'],
})
export class MonitorComponent implements OnInit {

    private entries: LogEntry[] = [];

    @ViewChild('bottom') bottom: ElementRef;

    private autoScroll: boolean = true;

    constructor( @Inject(NgZone) private ngZone: NgZone, @Inject(LogService) private logService: LogService) { }

    ngOnInit(): void {
        this.logService.monitor().subscribe(
            (entry: LogEntry) => {
                this.ngZone.run(() => this.entries.push(entry));
                this.ngZone.run(() => this.autoScroll && this.bottom.nativeElement.scrollIntoView());
            },
            (error?: any) => this.ngZone.run(() => this.entries.push(error)));
    }

    clearLog(): void {
        console.log(`Clearing ${this.entries.length} entries.`);
        this.entries = [];
    }
}