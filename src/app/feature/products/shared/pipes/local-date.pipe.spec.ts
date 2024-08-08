import { LocalDatePipe } from './local-date.pipe';

describe('LocalDatePipe', () => {
  let pipe: LocalDatePipe;

  beforeEach(() => {
    pipe = new LocalDatePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform a valid date string to local date format', () => {
    const inputDate = '2023-01-01';
    const expectedOutput = '01/01/2023';
    expect(pipe.transform(inputDate)).toBe(expectedOutput);
  });

  it('should transform a Date object to local date format', () => {
    const inputDate = new Date('2023-01-01');
    const expectedOutput = '01/01/2023';
    expect(pipe.transform(inputDate)).toBe(expectedOutput);
  });

  it('should return an empty string for null or undefined input', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should handle invalid date strings', () => {
    const inputDate = 'invalid-date';
    const expectedOutput = '';
    expect(pipe.transform(inputDate)).toBe(expectedOutput);
  });
});
