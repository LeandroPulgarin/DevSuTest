import { formatDate } from './format-date';

describe('formatDate', () => {
  it('should format a valid date correctly', () => {
    const date = new Date(2023, 0, 1);
    const result = formatDate(date);
    expect(result).toBe('2023-01-01');
  });

  it('should format a date in February correctly', () => {
    const date = new Date(2023, 1, 15);
    const result = formatDate(date);
    expect(result).toBe('2023-02-15');
  });

  it('should format a date in December correctly', () => {
    const date = new Date(2023, 11, 5);
    const result = formatDate(date);
    expect(result).toBe('2023-12-05');
  });

  it('should pad month and day with leading zeros', () => {
    const date = new Date(2023, 2, 1);
    const result = formatDate(date);
    expect(result).toBe('2023-03-01');

    const date2 = new Date(2023, 10, 9);
    const result2 = formatDate(date2);
    expect(result2).toBe('2023-11-09');
  });

  it('should handle leap years', () => {
    const date = new Date(2024, 1, 29);
    const result = formatDate(date);
    expect(result).toBe('2024-02-29');
  });

  it('should handle invalid dates', () => {
    const date = new Date('invalid-date');
    const result = formatDate(date);
    expect(result).toBe('NaN-NaN-NaN');
  });
});
