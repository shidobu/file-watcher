import { Component } from "@angular/core";



@Component({
    selector: 'page-layout',
    template: `
    <ng-content select="header"></ng-content>
    <ng-content select="content"></ng-content>
    <ng-content select="footer"></ng-content>
    `
})
export class PageLayoutComponent {

}