import { Directive, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[mapfreInputPattern]'
})
export class InputPatternDirective {
  patterns = {
    alphanumericWithDashes: /[^a-zA-ZñÑáéíóúÁÉÍÓÚ0-9-\._\s]*/g,
    alphanumeric: /[^a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s]*/g,
    onlyLetters: /[^a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*/g,
    onlyNumbers: /[^0-9]+/g,
    alphanumericAddress: /[^a-zA-ZñÑ0-9\.\,\s]*/g
  };

  @Input() mapfreInputPattern: string;

  constructor() { }

  getValueReplaced(value, patternName): string {
    const pattern = this.patterns[patternName];
    const replacedValue = value.replace(pattern, '');

    return replacedValue;
  }

  /**
   * Reemplaza el value del input en el evento keyUp
   * basado en los patrones indicados en patterns y el @Input
   * appInputPattern
   */
  @HostListener('keyup', ['$event'])
  onReplaceKeyUp(event) {
    // Propiedades
    const { patterns } = this;

    // Métodos
    const { getValueReplaced } = this;

    // Inputs
    const { mapfreInputPattern } = this;

    const value = event.target.value;

    event.target.value = this.getValueReplaced(value, mapfreInputPattern);

  }

}

