import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment";

@Pipe({
  name: "dateActivity",
})
export class FormaDateActivityPipe implements PipeTransform {
  transform(date: any): string {
    const dateMomentObject = moment(date, 'YYYY-MM-DD');
    const dateObject = dateMomentObject.toDate();
    const day = new Intl.DateTimeFormat("es-ES", { day: "numeric" }).format(
      dateObject
    );
    const year = new Intl.DateTimeFormat("es-ES", { year: "numeric" }).format(
      dateObject
    );
    const month = new Intl.DateTimeFormat("es-ES", { month: "long" }).format(
      dateObject
    );
    const weekday = new Intl.DateTimeFormat("es-ES", {
      weekday: "long",
    }).format(dateObject);
    return `${this.titleCaseWord(weekday)} ${day} de ${this.titleCaseWord(month)} ${year}`;
  }

  titleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substring(1).toLowerCase();
  }
}
