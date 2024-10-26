import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormUtilsService {

  constructor() { }

  // Método para observar mudanças em um campo e habilitar o próximo campo
  observeFieldChanges(form: FormGroup, currentField: string, nextField: string): void {
    form.get(currentField)?.valueChanges.subscribe(() => {
      this.toggleField(form, nextField, form.get(currentField)?.valid ?? false);
    });
  }

  // Método para habilitar ou desabilitar um campo
  toggleField(form: FormGroup, fieldName: string, enable: boolean): void {
    const field = form.get(fieldName);
    if (field) {
      if (enable) {
        field.enable();
      } else {
        field.disable();
      }
    }
  }

  // Método para desabilitar todos os campos inicialmente
  disableAllFields(form: FormGroup, fields: string[]): void {
    fields.forEach(field => form.get(field)?.disable());
  }

  // Método para habilitar ou desabilitar múltiplos campos com base em condições
  toggleMultipleFields(form: FormGroup, fields: { name: string, condition: boolean }[]): void {
    fields.forEach(field => {
      this.toggleField(form, field.name, field.condition);
    });
  }

  isFieldValid: { [key: string]: boolean } = {
    brand: false,
    model: false,
    type: false,
    category: false,
    propulsion: false,
    motor: false,
  };

  updateFormField(
    vehicleForm: FormGroup,
    formControlName: string,
    selectedValue: any,
    loadFunction: ((id: number) => void) | null, // Aceita uma função ou null
    nextField: string
  ): void {
    if (selectedValue) {
      vehicleForm.get(formControlName)?.setValue(selectedValue.name);
      this.isFieldValid[formControlName] = true; // Marca como válido

      // Chama a função de carregamento somente se loadFunction não for null
      if (loadFunction) {
        loadFunction(selectedValue.id);
      }

      vehicleForm.get(nextField)?.enable(); // Habilita o próximo campo
    } else {
      vehicleForm.get(nextField)?.disable(); // Desabilita o próximo campo
      vehicleForm.get(nextField)?.reset(); // Reseta o valor do próximo campo
      this.isFieldValid[formControlName] = false; // Marca como inválido
    }
  }

  // Método auxiliar para resetar e desabilitar campos
  resetAndDisableFields(form: FormGroup, fields: string[]): void {
    fields.forEach(field => {
      form.get(field)?.reset(); // Reseta o campo
      form.get(field)?.disable(); // Desabilita o campo
    });
  }

}
