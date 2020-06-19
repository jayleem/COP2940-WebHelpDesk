import { Directive, HostListener } from '@angular/core';
import { Location } from '@angular/common';

@Directive({
    selector: '[backButton]'
})
export class BackButtonDirective {
    constructor(private location: Location) { }

    //when user clicks button go back
    //
    @HostListener('click')
    onClick() {
        this.location.back();
    }
}