// Angular Core
import { Component, Inject } from '@angular/core'; // Importa Component e Inject do núcleo Angular para criar componentes e injetar dados

// Angular Forms
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'; // Importa utilitários para criação e manipulação de formulários, incluindo validação

// Angular Material Dialog
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'; // Importa ferramentas para criar e manipular diálogos modais

// SweetAlert2
import Swal from 'sweetalert2'; // Biblioteca para exibir alertas bonitos e personalizáveis

// RxJS
import { catchError, of } from 'rxjs'; // Importa operadores para lidar com erros e criar observáveis

// Serviços
import { BrandService } from '../../../../../core/services/brand/brand.service'; // Serviço para operações relacionadas a marcas

// Modelos
import { Brand } from '../../../../../core/models/brand'; // Modelo de dados para marcas

// Componentes
import { FaqPopupComponent } from '../../../../../core/fragments/faq-popup/faq-popup.component'; // Componente de FAQ para exibir informações úteis

@Component({
  selector: 'app-modal-form-brand',
  templateUrl: './modal-form-brand.component.html',
  styleUrl: './modal-form-brand.component.scss'
})
export class ModalFormBrandComponent {
  // Formulário de marca
  brandForm!: FormGroup;

  // Flag para determinar se estamos editando uma marca
  editBrand: boolean = false;

  constructor(
    private brandService: BrandService, // Serviço para manipulação de marcas
    private formBuilder: FormBuilder, // Utilitário para construção de formulários
    private dialog: MatDialog, // Serviço para abrir modais
    public dialogRef: MatDialogRef<ModalFormBrandComponent>, // Referência ao diálogo
    @Inject(MAT_DIALOG_DATA) public data: Brand // Dados recebidos para o modal
  ) { }

  ngOnInit(): void {
    // Determina se estamos editando com base na existência de dados
    this.editBrand = !!this.data?.name;
    this.buildForm(); // Constrói o formulário
    console.log('editBrand:', this.editBrand);

    // Preenche o formulário se estivermos editando
    if (this.editBrand) {
      this.fillForm();
    }
  }

  // Constrói o formulário de marca
  buildForm() {
    this.brandForm = this.formBuilder.group({
      name: new FormControl(null, [Validators.required, Validators.minLength(3)]) // Campo nome com validação
    });
  }

  // Preenche o formulário com dados existentes, se disponíveis
  fillForm() {
    if (this.data.name) {
      this.brandForm.patchValue({
        name: this.data.name
        // activated: this.data.activated // Se necessário, adicionar este campo
      });
      console.log("fillForm", this.brandForm.value);
    } else {
      console.warn('Dados estão incompletos:', this.data);
    }
  }

  // Submete o formulário
  onSubmit() {
    if (this.brandForm.valid) {
      console.log('Formulário válido:', this.brandForm.value);
  
      // Determina a ação com base na edição
      const actionSucess = this.isEditing() ? 'atualizada' : 'cadastrada';
      const actionsError = this.isEditing() ? 'atualizar' : 'cadastrar';

      // Definindo a requisição com base na ação (cadastro ou atualização)
      const request$ = this.isEditing()
        ? this.brandService.update({ ...this.data, ...this.brandForm.value }) // Atualiza a marca
        : this.brandService.register(this.brandForm.value); // Cadastra uma nova marca
  
      // Realiza a requisição e separa as ações para sucesso e erro
      request$.subscribe({
        next: () => {
          this.handleSuccess(actionSucess); // Ação de sucesso
        },
        error: (response) => {
          console.log(response.error)
          this.handleError(response.error, actionsError); // Ação de erro
        }
      });
    } else {
      console.warn('Formulário inválido:', this.brandForm);
    }
  }
  
  // Ação de sucesso
  handleSuccess(action: string) {
    Swal.fire({
      title: 'Sucesso!',
      icon: 'success',
      text: `A marca ${this.brandForm.value.name} foi ${action} com sucesso.`,
      showConfirmButton: true,
      confirmButtonColor: '#19B6DD',
    }).then((result) => {
      if (result.isConfirmed || result.isDismissed) {
        this.closeModal(); // Fecha o modal após a confirmação
      }
    });
  }
  
  // Ação de erro
  handleError(error: any, action: string) {
    const errorMessage = error || `Ocorreu um erro ao tentar ${action} a marca. Tente novamente.`;
    Swal.fire({
      title: 'Erro!',
      icon: 'error',
      text: errorMessage, // Mensagem do backend ou genérica
      showConfirmButton: true,
      confirmButtonColor: 'red',
    });
  }
  
  

  // Verifica se estamos editando
  isEditing(): boolean {
    return !!this.data; // Retorna true se this.data estiver definido
  }

  // Fecha o modal
  closeModal() {
    this.dialogRef.close();
  }

  // Abre o modal de FAQ
  openFAQModal() {
    this.dialog.open(FaqPopupComponent, {
      data: {
        faqs: [
          {
            question: 'Como cadastrar uma nova marca?',
            answer: 'Para cadastrar uma nova marca, clique no botão "Nova marca" localizado na parte inferior direita da tabela. Isso abrirá um formulário onde você poderá inserir os detalhes da nova marca. Após preencher o formulário, clique em "Finalizar cadastro" para adicionar a nova marca à lista.'
          },
          {
            question: 'Como visualizar os detalhes de uma marca?',
            answer: 'Para visualizar os detalhes de uma marca, clique no ícone de "olho" (visibility) ao lado da marca que você deseja visualizar. Um modal será exibido mostrando todas as informações detalhadas sobre a marca selecionada.'
          },
          {
            question: 'Como editar uma marca existente?',
            answer: 'Para editar uma marca, clique no ícone de "lápis" (edit) ao lado da marca que você deseja modificar. Isso abrirá um modal com um formulário pré-preenchido com os dados da marca. Faça as alterações necessárias e clique em "Salvar" para atualizar as informações.'
          },
          {
            question: 'Como excluir uma marca?',
            answer: 'Para excluir uma marca, clique no ícone de "lixeira" (delete) ao lado da marca que você deseja remover. Você será solicitado a confirmar a exclusão. Após confirmar, a marca será removida da lista.'
          },
          {
            question: 'Como buscar marcas específicas?',
            answer: 'Use o campo de busca localizado acima da tabela. Digite o nome da marca que você deseja encontrar e a tabela será filtrada automaticamente para mostrar apenas as marcas que correspondem à sua pesquisa.'
          },
          {
            question: 'Como navegar entre as páginas da tabela?',
            answer: 'Use o paginador localizado na parte inferior da tabela para navegar entre as páginas de marcas. Você pode selecionar o número de itens por página e usar os botões de navegação para ir para a página anterior ou seguinte.'
          }
        ]
      }
    });
  }
}