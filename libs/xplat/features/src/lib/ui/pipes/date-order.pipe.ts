import { Pipe, PipeTransform } from '../forks/angular-datetime-picker/node_modules/@angular/core/core';

@Pipe({
  name: 'orderByDate',
  pure: true,
})
export class DateOrderPipe implements PipeTransform {
  transform(value: any[], sortBy: string): any {
    if (value) {
      return value.sort((a, b) => {
        if (!a[sortBy]) {
          throw new Error(`Incorrect orderByDate property`);
        }

        const dateA = new Date(a[sortBy]).getTime();
        const dateB = new Date(b[sortBy]).getTime();
        return dateB - dateA;
      });
    }
  }
}
