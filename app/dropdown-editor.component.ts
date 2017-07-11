import { DropdownList } from './dropdown-list';
import { Component, Inject, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { DirectoryService } from './directory.service';

@Component({
    moduleId: module.id,
    selector: 'dropdown-editor',
    templateUrl: 'dropdown-editor.component.html',
    styleUrls: ['dropdown-editor.component.css'],
})
export class DropdownEditorComponent implements OnInit {
    @Input() private entries: DropdownList<string>;
    private previous: DropdownList<string>;

    private errors: string[] = [];
    @Output() private updateList: EventEmitter<DropdownList<string>> = new EventEmitter<DropdownList<string>>();

    private seek: string = "";
    private mode: string = 'view';
    private listSelection: number = -1;
    private itemSelection: number = -1;
    private displayList: boolean = false;

    constructor( @Inject(NgZone) private ngZone: NgZone, @Inject(DirectoryService) private directoryService: DirectoryService) { }

    ngOnInit(): void {
        this.setPreviousValues(this.entries);
    }

    private setPreviousValues(value: DropdownList<string>) {
        this.previous = JSON.parse(JSON.stringify(value));
    }

    addError(error: string): void {
        this.errors.push(error);
    }

    clearErrors(): void {
        this.errors = [];
    }

    hasErrors(): boolean {
        return this.errors.length > 0;
    }

    private handleKeyDown(event: KeyboardEvent): void {
        if (event.keyCode == 8) { //backspace

        }
        else if (event.keyCode == 13) { //enter
            if (this.seek == "") {
                this.save();
            } else {
                this.addItemToList(this.seek);
            }
        }
        else if (event.keyCode == 27) { //escape

        }
        else if (event.keyCode == 37) { // l

        }
        else if (event.keyCode == 38) { // u

        }
        else if (event.keyCode == 39) { // r

        }
        else if (event.keyCode == 40) { // d

        }
    }

    private addItemToList(entry: string): void {
        if (this.entries.activeItems.indexOf(entry) < 0) {
            this.entries.activeItems.push(entry);

            if (this.entries.allItems.indexOf(entry) < 0) {
                this.entries.allItems.push(entry);
            }

            this.seek = "";
            this.displayList = false;
        }
    }

    private removeItemFromList(entry: string): void {
        var index = this.entries.activeItems.indexOf(entry);

        if (index >= 0) {
            this.entries.activeItems.splice(index, 1);
        }
    }

    private save(): void {
        this.switchToViewMode();
        this.fireUpdateList();
    }

    private cancel(): void {
        this.entries.activeItems = this.previous.activeItems;
        this.entries.allItems = this.previous.allItems;
        this.switchToViewMode();
    }

    private fireUpdateList() {
        this.updateList.emit(this.entries);
    }

    private switchToViewMode() {
        this.mode = 'view';
        this.setPreviousValues(this.entries);
    }

    private switchToEditMode() {
        this.mode = 'edit';
    }
}