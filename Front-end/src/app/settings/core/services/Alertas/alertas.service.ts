import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  constructor() { }

  showSwal(icon: 'success' | 'error' | 'warning' | 'info', title: string, text?: string, confirmButtonText?: string, customClass?: any ) {
    confirmButtonText = confirmButtonText? confirmButtonText : 'Ok';

    return Swal.fire({
      icon,
      title,
      text,
      confirmButtonText,
      customClass
    }).then((result) => {
      return result.isConfirmed;
    });
  }

  showSuccess(title: string, text?: string, confirmButtonText?: string ,customClass?: any) : Promise<boolean>{
    customClass = customClass? customClass : {
      popup: 'custom-swal-popup-success',
      confirmButton: 'custom-swal-confirm-button-success',
    };
    return this.showSwal('success', title, text, confirmButtonText, customClass)
  }

  showError(title: string, text?: string, confirmButtonText?: string , customClass?: any) : Promise<boolean>{
    customClass = customClass? customClass : {
      popup: 'custom-swal-popup-error',
      confirmButton: 'custom-swal-confirm-button-error',
    };
    return this.showSwal('error', title, text, confirmButtonText, customClass)
  }

  showInfo(title: string, text?: string, confirmButtonText?: string , customClass?: any) : Promise<boolean> {
    customClass = customClass? customClass : {
      popup: 'custom-swal-popup-success',
      confirmButton: 'custom-swal-confirm-button-success',
    };
    return this.showSwal('info', title, text, confirmButtonText, customClass)
  }

  showWarning(title: string, text?: string, confirmButtonText?: string, cancelButtonText?: string , customClass?: any): Promise<boolean> {
    customClass = customClass ? customClass : {
      popup: 'custom-swal-popup-success',
      confirmButton: 'custom-swal-confirm-button-success',
      cancelButton: 'custom-swal-confirm-button-error',
    };

    return Swal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonText: confirmButtonText ? confirmButtonText : 'Ok',
      showCancelButton: true,  // Adiciona o botão de cancelar
      cancelButtonText: cancelButtonText ? cancelButtonText : 'Cancelar',
      customClass
    }).then((result) => {
      return result.isConfirmed;  // Retorna true se o usuário clicou em "Ok", false se clicou em "Cancelar"
    });
  }
}
