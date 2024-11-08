// Angular Core
import { Component, Inject } from '@angular/core'; // Importa Component e Inject do núcleo Angular para criar componentes e injetar dados

// Angular Forms
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'; // Importa utilitários para criação e manipulação de formulários, incluindo validação

// Angular Material Dialog
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'; // Importa ferramentas para criar e manipular diálogos modais

// SweetAlert2
import Swal from 'sweetalert2'; // Biblioteca para exibir alertas bonitos e personalizáveis

// Serviços
import { BrandService } from '../../../../../core/services/brand/brand.service'; // Serviço para operações relacionadas a marcas

// Modelos
import { Brand } from '../../../../../core/models/brand'; // Modelo de dados para marcas

// Componentes
import { FaqPopupComponent } from '../../../../../core/fragments/faq-popup/faq-popup.component'; // Componente de FAQ para exibir informações úteis
import { AlertasService } from '../../../../../core/services/Alertas/alertas.service';

/**
 * Componente de formulário para criar ou editar marcas em um modal.
 *
 * **Passo a passo de chamada de métodos:**
 * 1. **ngOnInit**: Inicializa o formulário e verifica se está no modo de edição.
 * 2. **buildForm**: Cria o formulário reativo com os campos necessários.
 * 3. **fillForm**: Preenche o formulário com os dados da marca, se estiver no modo de edição.
 * 4. **onSubmit**: Envia os dados do formulário para cadastrar ou atualizar a marca.
 * 5. **closeModal**: Fecha o modal ao ser chamado.
 * 6. **openFAQModal**: Abre um modal com perguntas frequentes (FAQ).
 */
@Component({
  selector: 'app-modal-form-brand',
  templateUrl: './modal-form-brand.component.html',
  styleUrl: './modal-form-brand.component.scss'
})
export class ModalFormBrandComponent {
  /**
   * Formulário de marca que será usado para criar ou editar a marca.
   * Utiliza validação de campos.
   */
  brandForm!: FormGroup;

  /**
   * Flag para determinar se o formulário está no modo de edição.
   * @type {boolean}
   */
  editBrand: boolean = false;

  /**
   * Construtor do componente.
   *
   * @param brandService Serviço de marca usado para criar e atualizar marcas.
   * @param formBuilder Utilitário para construir formulários reativos.
   * @param dialog Serviço para abrir modais.
   * @param dialogRef Referência ao modal atual, usado para fechá-lo.
   * @param data Dados injetados no modal, usados para determinar se estamos editando uma marca.
   */
  constructor(
    private brandService: BrandService, // Serviço para manipulação de marcas
    private alertService: AlertasService, // Serviço para exibir alertas
    private formBuilder: FormBuilder, // Utilitário para construção de formulários
    private dialog: MatDialog, // Serviço para abrir modais
    public dialogRef: MatDialogRef<ModalFormBrandComponent>, // Referência ao diálogo
    @Inject(MAT_DIALOG_DATA) public data: Brand // Dados recebidos para o modal
  ) { }

  /**
   * Método de inicialização do componente.
   * Configura o estado de edição e inicializa o formulário.
   */
  ngOnInit(): void {
    this.editBrand = !!this.data?.name; // Determina se estamos editando com base na existência de dados
    this.buildForm(); // Constrói o formulário
    if (this.editBrand) {
      this.fillForm(); // Preenche o formulário se estivermos editando
    }
  }

  /**
   * Constrói o formulário de marca.
   * Define os campos e suas validações.
   */
  buildForm() {
    this.brandForm = this.formBuilder.group({
      name: new FormControl(null, [Validators.required, Validators.minLength(3)]) // Campo nome com validação
    });
  }

  /**
   * Preenche o formulário com os dados da marca recebidos.
   * Usado quando estamos no modo de edição.
   */
  fillForm() {
    if (this.data.name) {
      this.brandForm.patchValue({
        name: this.data.name
      });
    }
  }

  /**
 * Envia o formulário para cadastrar ou atualizar a marca.
 * Exibe alertas de sucesso ou erro conforme a ação realizada.
 *
 * @description Este método verifica se o formulário é válido, determina se está em modo de edição ou de cadastro,
 *              e realiza a requisição correspondente ao serviço de marcas. Após a requisição, ele trata as respostas
 *              para exibir alertas apropriados ao usuário.
 *
 * @returns {void}
 */
  onSubmit() {
    if (this.brandForm.valid) {
      // Determina a ação com base na edição
      const actionSucess = this.isEditing() ? 'atualizada' : 'cadastrada';

      // Definindo a requisição com base na ação (cadastro ou atualização)
      const request$ = this.isEditing()
        ? this.brandService.update({ ...this.data, ...this.brandForm.value }) // Atualiza a marca
        : this.brandService.register(this.brandForm.value); // Cadastra uma nova marca

      // Realiza a requisição e separa as ações para sucesso e erro
      request$.subscribe({
        next: () => {
          this.alertService.showSuccess('Sucesso!', `A marca ${this.brandForm.value.name} foi ${actionSucess} com sucesso.`);
          this.closeModal();
        },
        error: (response) => {
          this.alertService.showError('Erro!', response.error);
        }
      });
    }
  }

  /**
   * Verifica se o formulário está no modo de edição.
   *
   * @returns {boolean} Retorna `true` se estiver editando, `false` caso contrário.
   */
  isEditing(): boolean {
    return !!this.data; // Retorna true se this.data estiver definido
  }

  /**
   * Fecha o modal atual.
   */
  closeModal() {
    this.dialogRef.close();
  }

  /**
   * Abre um modal de FAQ (Perguntas Frequentes).
   * Exibe dicas sobre como cadastrar, editar e gerenciar marcas.
   */
  openFAQModal() {
    this.dialog.open(FaqPopupComponent, {
      width: '500px',
      data: {
        faqs: [
          {
            question: 'Como cadastrar uma nova marca?',
            answer: 'Para cadastrar uma nova marca, preencha o campo "Marca" com o nome desejado e clique no botão "Finalizar cadastro". Todos os campos obrigatórios devem ser preenchidos corretamente para habilitar a opção de finalização.'
          },
          {
            question: 'Como editar uma marca existente?',
            answer: 'Para editar uma marca, selecione a marca desejada na lista principal e, em seguida, clique em "Editar Marca". Faça as alterações necessárias e clique em "Atualizar Marca" para salvar.'
          },
          {
            question: 'Quais são os requisitos para o nome da marca?',
            answer: 'O nome da marca é um campo obrigatório e deve conter pelo menos 3 caracteres. Certifique-se de que o nome esteja correto antes de salvar.'
          },
          {
            question: 'Posso cancelar a operação de cadastro ou edição?',
            answer: 'Sim, você pode cancelar a operação a qualquer momento clicando no ícone de seta para voltar no canto superior esquerdo da tela. Nenhuma alteração será salva até que você clique em "Finalizar cadastro" ou "Atualizar Marca".'
          },
          {
            question: 'Por que não consigo clicar em "Finalizar cadastro"?',
            answer: 'Certifique-se de que todos os campos obrigatórios estão preenchidos corretamente. O botão "Finalizar cadastro" será habilitado apenas quando todos os requisitos forem atendidos.'
          }
        ]
      }
    });
  }
}
