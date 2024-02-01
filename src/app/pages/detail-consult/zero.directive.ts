import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator } from '@angular/forms';
@Directive({
  selector: '[integerInput][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => IntegerInputDirective),
      multi: true
    }
  ]
})
export class IntegerInputDirective implements Validator {

  validate(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (value === '0' || value === '00') {
      return { zeroError: true };
    }
    return null;
  }
}
