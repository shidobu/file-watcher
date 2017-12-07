import { Component } from "@angular/core";



@Component({
    selector: 'column',
    template: `
    <ng-content select="header"></ng-content>
    <ng-content select="content"></ng-content>
    <ng-content select="footer"></ng-content>
    `
})
export class ColumnComponent {

}