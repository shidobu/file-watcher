import { DropdownList } from '../dropdown-list';
import { FolderInputComponent } from './folder-input.component';
import { Component, Inject, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DirectoryService } from '../services/directory.service';
import { WatcherOptions } from '../watcher-options';

@Component({
    moduleId: module.id,
    selector: 'options',
    templateUrl: 'options.component.html',
    styleUrls: ['options.component.css'],
})
export class OptionsComponent {

    @Input() private options: WatcherOptions;
    @Output() private optionsChange: EventEmitter<WatcherOptions> = new EventEmitter<WatcherOptions>();
    @Output() private invalidOptions: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor( @Inject(DirectoryService) private directoryService: DirectoryService) { }

    updateOptions() {
        this.optionsChange.emit(this.options);
    }

    private updateIncludedItems(list: DropdownList<string>): void {
        this.options.includedPatterns = list;
        this.updateOptions();
    }

    private updateExcludedItems(list: DropdownList<string>): void {
        this.options.excludedPatterns = list;
        this.updateOptions();
    }

    validateDirectory(current: string, component: FolderInputComponent): void {
        if (component.hasErrors()) {
            this.invalidOptions.emit(true);
        } else {
            this.directoryService.validatePathNotInExcludedPattern(component.currentDirectory, this.options.excludedPatterns.activeItems, (err?: string) => {
                if (err != null) {
                    component.addError(err);
                    this.invalidOptions.emit(true);
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
                            this.invalidOptions.emit(true);
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
                                    this.invalidOptions.emit(true);
                                } else {
                                    if (current == "source") {
                                        this.options.sourceDirectory = component.currentDirectory;
                                    } else {
                                        this.options.outputDirectory = component.currentDirectory;
                                    }

                                    this.updateOptions();
                                    this.invalidOptions.emit(false);
                                }
                            });
                        }
                    });
                }
            });
        }
    }
}