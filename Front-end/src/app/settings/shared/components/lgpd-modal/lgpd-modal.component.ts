import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-lgpd-modal',
  templateUrl: './lgpd-modal.component.html',
  styleUrl: './lgpd-modal.component.scss'
})
export class LgpdModalComponent {
  @ViewChild('lgpdTitle') lgpdTitle!: ElementRef;

  // Controlador para aceitação dos termos da LGPD
  acceptTermsControl = new FormControl(false, [Validators.requiredTrue, Validators.required]);

  // Perguntas e respostas específicas da LGPD
  lgpdFaqs: { question: string; answer: string }[] = [];

  constructor(
    public dialogRef: MatDialogRef<LgpdModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Recebe as perguntas e respostas via data
    this.lgpdFaqs = data.lgpds;
  }

  // Método de confirmação de aceitação dos termos
  onConfirm(): void {
    if (this.acceptTermsControl.valid) {
      this.dialogRef.close(true); // Passa o valor true se os termos foram aceitos
    }
  }
}
