// Angular Core
import { Component, Inject } from '@angular/core';

// Angular Material Dialog
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

// Modelos
import { Brand } from '../../../../../core/models/brand';

/**
 * Componente de modal para exibir os detalhes de uma marca.
 *
 * **Passo a passo de chamada de métodos:**
 * 1. **ngOnInit**: O modal é aberto com os dados da marca recebidos via `MAT_DIALOG_DATA`.
 * 2. **closeModal**: Fecha o modal quando acionado.
 */
@Component({
  selector: 'app-modal-details-brand',
  templateUrl: './modal-details-brand.component.html',
  styleUrls: ['./modal-details-brand.component.scss']
})
export class ModalDetailsBrandComponent {

  /**
   * A marca que será exibida no modal.
   * Recebe os dados da marca através da injeção de dependência.
   */
  brand!: Brand;

  /**
   * Construtor do componente.
   *
   * @param dialogRef Referência ao diálogo para controlar seu estado (fechar, abrir, etc.).
   * @param data Dados da marca injetados no modal para exibição.
   */
  constructor(
    public dialogRef: MatDialogRef<ModalDetailsBrandComponent>, // Referência ao diálogo
    @Inject(MAT_DIALOG_DATA) public data: Brand, // Dados recebidos para exibição no modal
  ) {
    // Inicializa a marca com os dados recebidos
    this.brand = data;
  }

  /**
   * Método para fechar o modal.
   * Quando chamado, fecha a janela de diálogo ativa.
   */
  closeModal() {
    this.dialogRef.close();
  }
}
