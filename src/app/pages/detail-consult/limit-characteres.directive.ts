import { Directive, ElementRef, HostListener, Input, forwardRef } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator, NgControl } from '@angular/forms';
@Directive({
  selector: '[inputrestriction]'
})
export class InputRestrictionDirective {
  @Input('inputrestriction') InputRestriction: number;

  constructor(private control: NgControl) {}

  @HostListener('input', ['$event']) onInputChange(event) {
    const value = this.control.value || '';
    if (value.length > this.InputRestriction) {
      this.control.control.setValue(value.slice(0, this.InputRestriction),
      event.stopPropagation())
    }
  }
}
