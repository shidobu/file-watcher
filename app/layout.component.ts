import { Component } from "@angular/core";



@Component({
    selector: 'layout',
    template: `
    <ng-content select="header"></ng-content>
    <ng-content select="content"></ng-content>
    <ng-content select="footer"></ng-content>
    `
})
export class LayoutComponent {

}