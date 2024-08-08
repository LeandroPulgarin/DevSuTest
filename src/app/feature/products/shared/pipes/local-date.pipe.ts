import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localDate',
  standalone: true,
})
export class LocalDatePipe implements PipeTransform {
  transform(value: string | Date | undefined | null): string {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return '';
    }
    const localDateString = date.toISOString().split('T')[0];
    const [year, month, day] = localDateString.split('-');

    return `${day}/${month}/${year}`;
  }
}
