import { LogType, LogEntry } from '../services/log.service';
import { Component, Input } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'log-item',
    templateUrl: 'log-item.component.html',
    styleUrls: ['log-item.component.css'],
})
export class LogItemComponent {
    @Input() private entry: LogEntry;

    public get entryType(): string {
        return LogType[this.entry.type];
    }
}