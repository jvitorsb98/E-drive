import { FormControl } from '@angular/forms';
import { futureYearValidator } from './future-year-validator';

describe('Future Year Validator', () => {
  const currentYear = new Date().getFullYear();
  const minYear = 1901;

  it('should return null for a valid year within range', () => {
    const control = new FormControl(currentYear);
    const result = futureYearValidator(control);
    expect(result).toBeNull();
  });

  it('should return null for the minimum valid year (1901)', () => {
    const control = new FormControl(minYear);
    const result = futureYearValidator(control);
    expect(result).toBeNull();
  });

  it('should return an error for a year greater than the current year', () => {
    const control = new FormControl(currentYear + 1);
    const result = futureYearValidator(control);
    expect(result).toEqual({
      invalidYear: true,
      currentYear: currentYear
    });
  });

  it('should return an error for a year less than 1901', () => {
    const control = new FormControl(minYear - 1);
    const result = futureYearValidator(control);
    expect(result).toEqual({
      invalidYear: true,
      currentYear: currentYear
    });
  });

  it('should return null for an empty value', () => {
    const control = new FormControl('');
    const result = futureYearValidator(control);
    expect(result).toBeNull();
  });

  it('should return null for a non-numeric value', () => {
    const control = new FormControl('abc');
    const result = futureYearValidator(control);
    expect(result).toBeNull();
  });

  it('should return null for a null value', () => {
    const control = new FormControl(null);
    const result = futureYearValidator(control);
    expect(result).toBeNull();
  });
});
