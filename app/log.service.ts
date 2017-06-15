import { Injectable } from "@angular/core";
import * as Rx from "rxjs";

@Injectable()
export class LogService {
    observer: Rx.Observer<LogEntry>;
    publishedObservable: Rx.ConnectableObservable<LogEntry>;

    constructor() { }

    // log service
    public monitor(): Rx.ConnectableObservable<LogEntry> {
        if (this.publishedObservable == null) {
            this.publishedObservable = Rx.Observable.create((observer: Rx.Observer<LogEntry>) => {
                this.observer = observer;
            }).publish();
            this.publishedObservable.connect();
        }

        return this.publishedObservable;
    }

    public file(...messages: string[]): void {
        if (this.observer != null) {
            this.observer.next(this.createEntry(LogType.File, messages));
        }
    }

    public folder(...messages: string[]): void {
        if (this.observer != null) {
            this.observer.next(this.createEntry(LogType.Folder, messages));
        }
    }

    // info
    public info(...messages: string[]): void {
        if (this.observer != null) {
            this.observer.next(this.createEntry(LogType.Info, messages));
        }
    }
    // debug

    public debug(...messages: string[]): void {
        if (this.observer != null) {
            this.observer.next(this.createEntry(LogType.Debug, messages));
        }
    }

    // error
    public error(...messages: string[]): void {
        if (this.observer != null) {
            this.observer.next(this.createEntry(LogType.Error, messages));
        }
    }

    private createEntry(type: LogType, messages: string[]) {
        var entry = new LogEntry();
        entry.type = type;
        entry.messages = messages;
        return entry;
    }
}

export class LogEntry {
    public type: LogType;
    public messages: string[];
}

export enum LogType {
    Info,
    Debug,
    Error,
    File,
    Folder
}