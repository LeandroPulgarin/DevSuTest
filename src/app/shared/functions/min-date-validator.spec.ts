import { FormControl } from '@angular/forms';
import { minDateValidator } from './min-date-validator';

describe('minDateValidator', () => {
  let minDate: string;

  beforeEach(() => {
    minDate = '2023-01-01';
  });

  it('should return null for valid date greater than or equal to minDate', () => {
    const control = new FormControl('2023-01-02');
    const validator = minDateValidator(minDate);
    const result = validator(control);
    expect(result).toBeNull();
  });

  it('should return null for empty control value', () => {
    const control = new FormControl('');
    const validator = minDateValidator(minDate);
    const result = validator(control);
    expect(result).toBeNull();
  });

  it('should return an error for date less than minDate', () => {
    const control = new FormControl('2022-12-31');
    const validator = minDateValidator(minDate);
    const result = validator(control);
    expect(result).toEqual({ minDate: { value: minDate } });
  });

  it('should return an error for invalid date string', () => {
    const control = new FormControl('invalid-date');
    const validator = minDateValidator(minDate);
    const result = validator(control);
    expect(result).toEqual({ minDate: { value: minDate } });
  });

  it('should return null for valid date equal to minDate', () => {
    const control = new FormControl('2023-01-01');
    const validator = minDateValidator(minDate);
    const result = validator(control);
    expect(result).toBeNull();
  });
});
