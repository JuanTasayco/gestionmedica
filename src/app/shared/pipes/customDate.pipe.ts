import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {

  transform(value: any): any {
    if (value) {
      const dateParts = value.split('-');
      return  `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` ;
    }
    return value;
  }
}
