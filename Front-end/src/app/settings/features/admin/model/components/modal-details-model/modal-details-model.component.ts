// Angular Core
import { Component, Inject } from '@angular/core'; // Importa Component e Inject do núcleo Angular para criar componentes e injetar dados

// Angular Material Dialog
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'; // Importa ferramentas para criar e manipular diálogos modais

// Modelos
import { Model } from '../../../../../core/models/model'; // Modelo de dados para modelos

@Component({
  selector: 'app-modal-details-model',
  templateUrl: './modal-details-model.component.html',
  styleUrls: ['./modal-details-model.component.scss'] // Corrigido para styleUrls
})
export class ModalDetailsModelComponent {
  model!: Model; // Modelo de dados para o componente

  constructor(
    public dialogRef: MatDialogRef<ModalDetailsModelComponent>, // Referência ao diálogo
    @Inject(MAT_DIALOG_DATA) public data: Model // Dados recebidos para o modal
  ) {
    this.model = data; // Inicializa o modelo com os dados recebidos
  }

  // Método para fechar o modal
  closeModal() {
    this.dialogRef.close();
  }
}

