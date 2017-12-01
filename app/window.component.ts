import { Component, Inject, NgZone } from '@angular/core';

import { WatcherOptions } from './watcher-options';
import { WatcherService } from './services/watcher.service';
var jsonp = require('../package.json!json.js');

let settings = SystemJS._nodeRequire("electron-settings");

@Component({
    moduleId: module.id,
    selector: 'window',
    providers: [WatcherService],
    templateUrl: 'window.component.html',
    styleUrls: ['window.component.css'],
})
export class WindowComponent {
    private options: WatcherOptions;

    private isWatching: boolean = false;
    private isValid: boolean = false;

    constructor( @Inject(NgZone) private ngZone: NgZone, @Inject(WatcherService) private watcherService: WatcherService) { }

    ngOnInit(): void {
        var defaultOptions = settings.get('options', null);
        if (defaultOptions != null) {
            this.options = defaultOptions;
        }

        if (this.options == null) {
            this.options = new WatcherOptions();
        }
    }

    private startWatch(): void {
        try {
            this.watcherService.watch(this.options);
            this.isWatching = true;
        } catch (error) {
            console.log(error);
        }
    }

    private stopWatch(): void {
        try {
            this.watcherService.stop();
            this.isWatching = false;
        } catch (error) {
            console.log(error);
        }
    }

    private saveSettings(value: WatcherOptions) {
        settings.set('options', value);
        this.options = value;
    }

    private setValid(value: boolean): void {
        setTimeout(() => {
            this.ngZone.run(() => {
                this.isValid = value;
            });
        }, 5);
    }

    private get version() : string {
        return jsonp.version;
    }
}