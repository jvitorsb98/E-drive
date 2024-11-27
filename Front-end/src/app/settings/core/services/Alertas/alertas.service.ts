import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  constructor() { }

  showSwal(icon: 'success' | 'error' | 'warning' | 'info', title: string, text?: string, confirmButtonText?: string, customClass?: any) {
    confirmButtonText = confirmButtonText ? confirmButtonText : 'Ok';

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

  showSuccess(title: string, text?: string, confirmButtonText?: string, customClass?: any): Promise<boolean> {
    customClass = customClass ? customClass : {
      popup: 'custom-swal-popup-success',
      confirmButton: 'custom-swal-confirm-button-success',
    };
    return this.showSwal('success', title, text, confirmButtonText, customClass)
  }

  showError(title: string, text?: string, confirmButtonText?: string, customClass?: any): Promise<boolean> {
    customClass = customClass ? customClass : {
      popup: 'custom-swal-popup-error',
      confirmButton: 'custom-swal-confirm-button-error',
    };
    return this.showSwal('error', title, text, confirmButtonText, customClass)
  }

  showInfo(title: string, text?: string, confirmButtonText?: string, customClass?: any): Promise<boolean> {
    customClass = customClass ? customClass : {
      popup: 'custom-swal-popup-success',
      confirmButton: 'custom-swal-confirm-button-success',
    };
    return this.showSwal('info', title, text, confirmButtonText, customClass)
  }

  showWarning(title: string, text?: string, confirmButtonText?: string, cancelButtonText?: string, customClass?: any): Promise<boolean> {
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

  showSwal2(
    icon: 'success' | 'error' | 'warning' | 'info',
    title: string,
    htmlContent?: string,
    confirmButtonText?: string,
    customClass?: any
  ) {
    confirmButtonText = confirmButtonText ? confirmButtonText : 'Ok';

    return Swal.fire({
      icon,
      title,
      html: htmlContent,  // Usamos 'html' para inserir a tabela
      confirmButtonText,
      customClass
    }).then((result) => {
      return result.isConfirmed;
    });
  }

  showTableAlert(
    title: string,
    headers: string[],
    rows: any[],
    confirmButtonText?: string,
    customClass?: any
  ): Promise<boolean> {
    const tableHtml = this.generateTableHtml(headers, rows);

    return this.showSwal2(
      'info',
      title,
      tableHtml,
      confirmButtonText,
      customClass
    );
  }

  private generateTableHtml(headers: string[], rows: string[][]): string {
    const headerHtml = headers.map(header =>
      `<th style="border: 1px solid #ddd; padding: 3px; background-color: #f2f2f2; font-size: 10px;">${header}</th>`).join('');

    const rowsHtml = rows
      .map(row => `<tr>${row.map(cell => `<td style="border: 1px solid #ddd; padding: 3px; text-align: left; font-size: 10px;">${cell}</td>`).join('')}</tr>`)
      .join('');

    return `
      <div style="overflow-x:auto; max-width: 100%;">
        <table style="font-size: 8px; width: 100%; border-collapse: collapse;">
          <thead style="font-weight: bold;">
            <tr>${headerHtml}</tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
    `;
  }

}
