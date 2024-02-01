import {
    Directive,
    ElementRef,
    Input,
    HostListener
} from '@angular/core';
import { FormControlName, NgControl } from '@angular/forms';

@Directive({
    selector: '[inputrestriction]'
})
export class InputRestrictionDirective {
    @Input('inputrestriction') InputRestriction!: any;

    constructor(private el: ElementRef, private control: NgControl) { }

    @HostListener('input', ['$event']) onInputChange(event: any) {
        const value = this.control.value || '';
        if (value.length > this.InputRestriction) {
            this.control.control.setValue(value.slice(0, this.InputRestriction), { emitEvent: false });
            event.stopPropagation();
        }
    }
}
