import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from '../../core/services/user/user.service';

//TODO - Refatorar esses metodos de validação de e-mail para um unico metodo
export function emailExistsValidator(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
    if (!control.value) {
      return of(null); // Se o campo estiver vazio, não faz validação
    }
    return userService.checkEmailExists(control.value).pipe(
      map(exists => exists ? { emailExists: true } : null),
      catchError(() => of(null)) // Em caso de erro, considera como e-mail não existente
    );
  };
}

export function emailnoExistsValidator(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
    if (!control.value) {
      return of(null); // Se o campo estiver vazio, não faz validação
    }
    return userService.checkEmailExists(control.value).pipe(
      map(exists => !exists ? { emailExists: true } : null),
      catchError(() => of(null)) // Em caso de erro, considera como e-mail não existente
    );
  };
}
