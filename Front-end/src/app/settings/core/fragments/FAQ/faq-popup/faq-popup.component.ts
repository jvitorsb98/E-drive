import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-faq-popup',
  templateUrl: './faq-popup.component.html',
  styleUrl: './faq-popup.component.scss'
})
export class FaqPopupComponent {
  faqs: { question: string; answer: string }[] = []; // FAQs como entrada

  constructor(public dialogRef: MatDialogRef<FaqPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.faqs = data.faqs;
  }
}
