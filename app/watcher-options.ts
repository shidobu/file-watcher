import { DropdownList } from './dropdown-list';


export class WatcherOptions {
    sourceDirectory: string;
    outputDirectory: string;
    includedPatterns: DropdownList<string>;
    excludedPatterns: DropdownList<string>;
    monitorExistingOnStart: boolean = false;

    constructor() {
        this.includedPatterns = new DropdownList('*');
        this.excludedPatterns = new DropdownList('**/.git', '**/node_modules');
    }
}