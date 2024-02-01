import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { RegularExpression } from '@shared/helpers/customValidators';

@Directive({
  selector: 'textarea[mapfreCharacteresFormat]'
})
export class CharacteresFormatDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) { }
  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const initialValue = this.el.nativeElement.value;
    const newValue = initialValue.replace(/\s+/g, ' ');
    const regex = RegularExpression.CHARACTERES_FORMAT;

    if (initialValue !== newValue) {
      this.el.nativeElement.value = newValue;
      this.el.nativeElement.dispatchEvent(new Event('input'));
      return;
    }

    if (!regex.test(initialValue)) {
      const filteredValue =
      initialValue.replace(
        /[^A-Za-zÑñáéíóúÁÉÍÓÚ0-9,\[\]\\()\'\"+:-;*{}\_:!¿|=%$#\/\.\-?&].$/g, '');
      this.renderer.setProperty(this.el.nativeElement, 'value', filteredValue);
    }
  }
}
