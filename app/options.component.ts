import { FolderInputComponent } from './folder-input.component';
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

    validateDirectory(current: string, component: FolderInputComponent): void {
        this.directoryService.validatePathNotInExcludedPattern(component.currentDirectory, this.options.excludedPatterns, (err?: string) => {
            if (err != null) {
                component.addError(err);
            } else {
                var other: string;
                if (current == "source") {
                    other = this.options.outputDirectory;
                } else {
                    other = this.options.sourceDirectory;
                }

                this.directoryService.validatePathsAreUnique(component.currentDirectory, other, (err?: string) => {
                    if (err != null) {
                        component.addError(err);
                    } else {
                        var other: string;
                        if (current == "source") {
                            other = this.options.outputDirectory;
                        } else {
                            other = this.options.sourceDirectory;
                        }
                        this.directoryService.validatePathsNotRelated(component.currentDirectory, other, (err?: string) => {
                            if (err != null) {
                                component.addError(err);
                            } else {
                                if (current == "source") {
                                    this.options.sourceDirectory = component.currentDirectory;
                                } else {
                                    this.options.outputDirectory = component.currentDirectory;
                                }

                                this.updateOptions();
                            }
                        });
                    }
                });
            }
        });
    }
}