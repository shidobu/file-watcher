

export class DropdownList<T> {
    public activeItems: T[] = [];

    public allItems: T[] = [];

    constructor(...items: T[]) {
        if (items.length > 0) {
            this.allItems.push(...items);
        }
    }
}