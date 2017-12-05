import { Component, Inject, NgZone } from '@angular/core';

import { WatcherOptions } from './watcher-options';
import { WatcherService } from './services/watcher.service';
import { WatcherComponent } from './watcher.component';
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
    private watchers: Array<WatcherOptions>

    private isWatching: boolean = false;
    private isValid: boolean = false;

    constructor( @Inject(NgZone) private ngZone: NgZone, @Inject(WatcherService) private watcherService: WatcherService) { }

    ngOnInit(): void {
        var defaultOptions: Array<WatcherOptions> = settings.get('watcherOptions', null);
        if (defaultOptions != null) {
            this.watchers = defaultOptions;
        }

        if (this.watchers == null) {
            this.watchers = new Array<WatcherOptions>();
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

    private saveSettings(value: Array<WatcherOptions>) {
        settings.set('watcherOptions', value);
        this.watchers = value;
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