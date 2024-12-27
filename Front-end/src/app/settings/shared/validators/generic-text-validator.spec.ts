import { FormControl } from '@angular/forms';
import { genericTextValidator } from './generic-text-validator';

describe('Generic Text Validator', () => {
  const minLength = 3;
  const maxLength = 10;
  const validator = genericTextValidator(minLength, maxLength);

  it('should return null for a valid text within range', () => {
    const control = new FormControl('Valid123');
    const result = validator(control);
    expect(result).toBeNull();
  });

  it('should return null for an empty value', () => {
    const control = new FormControl('');
    const result = validator(control);
    expect(result).toBeNull();
  });

  it('should return an error for a text shorter than minLength', () => {
    const control = new FormControl('Hi');
    const result = validator(control);
    expect(result).toEqual({ invalidLength: true });
  });

  it('should return an error for a text longer than maxLength', () => {
    const control = new FormControl('ThisIsTooLong123');
    const result = validator(control);
    expect(result).toEqual({ invalidLength: true });
  });

  it('should return null for a text with spaces, letters, and numbers only', () => {
    const control = new FormControl('Text 123');
    const result = validator(control);
    expect(result).toBeNull();
  });

  it('should return an error for a text with special characters even if length is valid', () => {
    const control = new FormControl('Val!dText');
    const result = validator(control);
    expect(result).toEqual({ invalidFormat: true });
  });
});
