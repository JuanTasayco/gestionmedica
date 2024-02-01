import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'empty'
})
export class ValueEmptyPipe implements PipeTransform {

  transform(value: any): any {
    if (value === '0' || value === 0) {
      return  '' ;
    }
    return value;
  }

}
