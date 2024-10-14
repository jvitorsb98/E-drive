// Angular Core
import { Component, Inject } from '@angular/core'; // Importa Component e Inject do núcleo Angular para criar componentes e injetar dados

// Angular Material Dialog
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'; // Importa ferramentas para criar e manipular diálogos modais

// Modelos
import { Model } from '../../../../../core/models/model'; // Modelo de dados para modelos

/**
 * Componente modal para exibir os detalhes de um modelo.
 * Este modal é utilizado para apresentar informações detalhadas sobre um modelo específico.
 *
 * **Passo a passo de execução:**
 * 1. O modal é aberto com os dados de um `Model`.
 * 2. Exibe os detalhes do modelo no modal.
 * 3. Permite o fechamento do modal com o botão de ação.
 */
@Component({
  selector: 'app-modal-details-model',
  templateUrl: './modal-details-model.component.html',
  styleUrls: ['./modal-details-model.component.scss'] // Corrigido para styleUrls
})
export class ModalDetailsModelComponent {
  /**
   * Dados do modelo que serão exibidos no modal.
   *
   * @type {Model}
   */
  model!: Model;

  /**
   * Construtor do componente.
   *
   * @param dialogRef Referência ao modal, usada para controlar e fechar o diálogo.
   * @param data Dados do modelo injetados no modal, que serão exibidos ao usuário.
   */
  constructor(
    public dialogRef: MatDialogRef<ModalDetailsModelComponent>, // Referência ao diálogo
    @Inject(MAT_DIALOG_DATA) public data: Model // Dados recebidos para o modal
  ) {
    this.model = data; // Inicializa o modelo com os dados recebidos
  }

  /**
   * Método para fechar o modal.
   * Quando chamado, o modal é fechado e o controle retorna ao componente pai.
   */
  closeModal() {
    this.dialogRef.close();
  }
}
