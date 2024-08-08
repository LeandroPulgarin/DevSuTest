import { AbstractControl, ValidatorFn } from '@angular/forms';

export function minDateValidator(minDate: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: object } | null => {
    if (!control.value) {
      return null;
    }

    const inputDate = new Date(control.value);
    const min = new Date(minDate);

    return inputDate >= min ? null : { minDate: { value: minDate } };
  };
}
