import { Injectable } from "@angular/core";
import * as Rx from "rxjs";

let dialog = SystemJS._nodeRequire("electron").remote.dialog;
let anymatch = SystemJS._nodeRequire("anymatch");
import * as fs from "@node/fs";


@Injectable()
export class DirectoryService {
    prompt(existingDirectory?: string): Rx.Observable<string> {
        return Rx.Observable.create((observer: Rx.Observer<string>) => {
            dialog.showOpenDialog({
                properties: ['openDirectory'],
                defaultPath: existingDirectory
            }, (paths: string[]) => {
                if (paths != null && paths.length > 0) {
                    var path: string = paths[0];
                    this.validatePathExistsAndIsDirectory(path, (error?: any): void => {
                        if (error != null) {
                            observer.error(error);
                        } else {
                            observer.next(path);
                            observer.complete();
                        }
                    });
                } else {
                    observer.error("No path specified.");
                }
            });
        });
    }

    validatePathExistsAndIsDirectory(value: string, callback: DirectoryCallback): void {
        try {
            var stats = fs.statSync(value);

            if (!stats.isDirectory()) {
                callback("Value is not a folder.");
            } else {
                callback();
            }
        } catch (error) {
            callback("Path does not exist.");
        }
    }

    validatePathExistsAndIsDirectoryOrDoesNotExist(value: string, callback: DirectoryCallback): void {
        try {
            var stats = fs.statSync(value);

            if (!stats.isDirectory()) {
                callback("Value is not a folder.");
            } else {
                callback();
            }
        } catch (error) {
            callback();
        }
    }

    validatePathNotInExcludedPattern(value: string, ignoredPatterns: string | string[], callback: DirectoryCallback): void {
        if (anymatch(ignoredPatterns, value)) {
            callback("Path must not contain an ignored pattern.")
        } else {
            callback();
        }
    }

    validatePathsAreUnique(firstValue: string, secondValue: string, callback: DirectoryCallback): void {
        if (firstValue == secondValue) {
            callback("Path values must be different.");
        } else {
            callback();
        }
    }

    validatePathsNotRelated(firstValue: string, secondValue: string, callback: DirectoryCallback): void {
        if (firstValue.indexOf(secondValue) >= 0 || secondValue.indexOf(firstValue) >= 0) {
            callback("Path must not be a child of another path.");
        } else {
            callback();
        }
    }
}

export type DirectoryCallback = (err?: string) => void;