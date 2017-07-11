/// <reference types="node" />

import { WatcherOptions } from './watcher-options';
import { LogService } from './log.service';

import { Inject, Injectable } from "@angular/core";
import * as Rx from "rxjs";

let fs = SystemJS._nodeRequire("fs");
let anymatch = SystemJS._nodeRequire("anymatch");
let chokidar = SystemJS._nodeRequire('chokidar');

@Injectable()
export class WatcherService {
    private watcher: any;

    constructor(@Inject(LogService) private logService: LogService) { }

    stop() {
        this.watcher.close();
        this.watcher = null;
    }

    watch(options: WatcherOptions): void {
        this.startWatch(options.sourceDirectory, options.outputDirectory, options.monitorExistingOnStart, options.includedPatterns.activeItems, options.excludedPatterns.activeItems);
    }

    private startWatch(source: string, output: string, monitorExistingOnStart: boolean, includedPatterns: string | string[], excludedPatterns: string | string[]): void {
        this.watcher = chokidar.watch(source, {
            cwd: source,
            ignoreInitial: !monitorExistingOnStart,
            persistent: true,
            ignored: excludedPatterns
        });

        this.watcher
            .on('add', (path: string) => this.addFile(path, source, output))
            .on('addDir', (path: string) => this.addDirectory(path, source, output))
            .on('change', (path: string) => this.updateFile(path, source, output))
            .on('unlink', (path: string) => this.unlinkFile(path, source, output))
            .on('unlinkDir', (path: string) => this.unlinkDirectory(path, source, output))
            .on('error', (error: string) => this.onError(error, source, output))
            .on('ready', () => this.logService.info('Initial scan complete. Ready for changes.'));
    }

    addFile(path: string, source: string, output: string): void {
        this.logService.file(path, 'added');
        var sourceFile = `${source}/${path}`;
        var outFile = `${output}/${path}`;

        this.createDirectory(path, source, output, () => {
            this.copy(sourceFile, outFile);
        });
    }

    updateFile(path: string, source: string, output: string): void {
        this.logService.file(path, 'updated');
        var sourceFile = `${source}/${path}`;
        var outFile = `${output}/${path}`;

        this.createDirectory(path, source, output, () => {
            this.copy(sourceFile, outFile);
        });
    }

    unlinkFile(path: string, source: string, output: string): void {
        this.logService.file(path, 'unlinked');
        var outFile = `${output}/${path}`;
        fs.removeSync(outFile);
    }

    addDirectory(path: string, source: string, output: string): void {
        this.logService.folder(path, 'added');

        this.createDirectory(path, source, output, () => { });
    }

    unlinkDirectory(path: string, source: string, output: string): void {
        this.logService.folder(path, 'unlinked');
    }

    onError(error: string, source: string, output: string): void {
        this.logService.error(error);
    }

    copy(from: string, to: string): Rx.Observable<any> {
        return Rx.Observable.create((observer: Rx.Observer<any>) => {
            fs.access(from, fs.F_OK, (error: any) => {
                if (error) {
                    observer.error(error);
                } else {
                    var inputStream = fs.createReadStream(from);
                    var outputStream = fs.createWriteStream(to);

                    var rejectCleanup = (error: any) => {
                        inputStream.destroy();
                        outputStream.end();
                        observer.error(error);
                    }

                    inputStream.on('error', rejectCleanup);
                    outputStream.on('error', rejectCleanup);

                    outputStream.on('finish', () => {
                        observer.next('success');
                        observer.complete();
                    });

                    inputStream.pipe(outputStream);
                }
            });
        }).publish().connect();
    }

    createDirectory(path: string, source: string, output: string, callback: (err?: any) => void): void {
        fs.stat(`${source}/${path}`, (err: any, stats: any) => {
            if (err != null) {
                callback(err);
            } else {

                var isFile = stats.isFile();
                fs.stat(`${output}/${path}`, (err: any, stats: any) => {
                    if (err != null) {
                        var parts = path.split(/[\/\\]/);

                        var fileName = null;
                        if (isFile) {
                            fileName = parts.pop();
                        }

                        if (parts.length == 1) {
                            this.logService.folder(`${parts.join('/')}`);
                            fs.mkdir(`${output}/${parts[0]}`, (err: any) => {
                                callback();
                            });
                        } else if (parts.length == 0) {
                            callback("Directory not created.")
                        } else {
                            var currentPart = parts.pop();
                            this.createDirectory(parts.join('/'), source, output, () => {
                                this.logService.folder(`${parts.join('/')}/${currentPart}`);
                                fs.mkdir(`${output}/${parts.join('/')}/${currentPart}`, (err: any) => {
                                    callback();
                                });
                            });
                        }
                    } else {
                        callback();
                    }
                });
            }
        });
    }
}