import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  constructor() { }

  showSwal(icon: 'success' | 'error' | 'warning' | 'info', title: string, text?: string, confirmButtonText?: string, customClass?: any ) {
    confirmButtonText = confirmButtonText? confirmButtonText : 'Ok';
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonText,
      customClass
    });
  }

  showSuccess(title: string, text?: string, confirmButtonText?: string ,customClass?: any) {
    customClass = customClass? customClass : {
      popup: 'custom-swal-popup-success',
      confirmButton: 'custom-swal-confirm-button-success',
    };
    this.showSwal('success', title, text, confirmButtonText, customClass);
  }

  showError(title: string, text?: string, confirmButtonText?: string , customClass?: any) {
    customClass = customClass? customClass : {
      popup: 'custom-swal-popup-error',
      confirmButton: 'custom-swal-confirm-button-error',
    };
    this.showSwal('error', title, text, confirmButtonText, customClass);
  }

  showInfo(title: string, text?: string, confirmButtonText?: string , customClass?: any) {
    customClass = customClass? customClass : {
      popup: 'custom-swal-popup-success',
      confirmButton: 'custom-swal-confirm-button-success',
    };
    this.showSwal('info', title, text, confirmButtonText, customClass);
  }

  showWarning(title: string, text?: string, confirmButtonText?: string , customClass?: any) {
    customClass = customClass? customClass : {
      popup: 'custom-swal-popup-success',
      confirmButton: 'custom-swal-confirm-button-success',
    };
    this.showSwal('warning', title, text, confirmButtonText, customClass);
  }
}
