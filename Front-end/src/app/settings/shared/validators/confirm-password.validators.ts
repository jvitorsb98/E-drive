import { AbstractControl, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(passwordControlName: string, confirmPasswordControlName: string): ValidatorFn {
  return (form: AbstractControl): { [key: string]: any } | null => {
    const password = form.get(passwordControlName)?.value;
    const confirmPassword = form.get(confirmPasswordControlName)?.value;

    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  };
}
