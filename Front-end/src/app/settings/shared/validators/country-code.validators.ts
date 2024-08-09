import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

const hasText = (control: AbstractControl | null): boolean => {
  return !!control && control.value && control.value.toString().trim().length > 0;
};

export const countryCodeValidator = (countries: { code: string }[]): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;
    const countryCodeControl = formGroup.get('countryCode');
    const value = countryCodeControl?.value;

    if (!hasText(countryCodeControl)) {
      // Se o campo estiver vazio, não definir nenhum erro
      return null;
    }

    const validOption = countries.some(country => country.code === value);

    if (countryCodeControl) {
      if (!validOption) {
        countryCodeControl.setErrors({ invalidCountry: true });
        countryCodeControl.markAsTouched();
      } else {
        countryCodeControl.setErrors(null);
      }
    }

    return null;
  };
};