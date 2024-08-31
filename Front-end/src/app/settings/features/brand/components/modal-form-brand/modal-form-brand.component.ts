import { Component, Inject } from '@angular/core';
import { BrandService } from '../../../../core/services/brand/brand.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Brand } from '../../../../core/models/brand';
import { catchError, of } from 'rxjs';
import { FaqPopupComponent } from '../../../../core/fragments/FAQ/faq-popup/faq-popup.component';

@Component({
  selector: 'app-modal-form-brand',
  templateUrl: './modal-form-brand.component.html',
  styleUrl: './modal-form-brand.component.scss'
})
export class ModalFormBrandComponent {
  brandForm!: FormGroup;
  editBrand: boolean = false;

  constructor(
    private brandService: BrandService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalFormBrandComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Brand
  ) { }

  ngOnInit(): void {
    this.editBrand = !!this.data?.name; // Atribui true se data.brand existir e false se não existir
    this.buildForm();
    console.log('editBrand:', this.editBrand);
    if (this.editBrand) {
      this.fillForm();
    }
  }

  buildForm() {
    this.brandForm = this.formBuilder.group({
      name: new FormControl(null, [Validators.required, Validators.minLength(3)])
    });
  }

  fillForm() {
    if (this.data.name) {
      this.brandForm.patchValue({
        name: this.data.name,
        // activated: this.data.activated
      });
      console.log("fillForm", this.brandForm.value);
    } else {
      console.warn('Dados estão incompletos:', this.data);
    }
  }

  submitForm() {
    if (this.brandForm.valid) {
      console.log('Formulário válido:', this.brandForm.value);
      const action = this.isEditing() ? 'atualizada' : 'cadastrada'; // Usa o método isEditing para determinar a ação

      const request$ = this.isEditing()
        ? this.brandService.updateBrand({ ...this.data, ...this.brandForm.value }) // Mistura os dados existentes com os atualizados
        : this.brandService.registerBrand(this.brandForm.value);

      request$.pipe(
        catchError(() => {
          Swal.fire({
            title: 'Erro!',
            icon: 'error',
            text: `Ocorreu um erro ao ${action} a marca. Tente novamente mais tarde.`,
            showConfirmButton: true,
            confirmButtonColor: 'red',
          });
          return of(null); // Continua a sequência de observáveis com um valor nulo
        })
      ).subscribe(() => {
        Swal.fire({
          title: 'Sucesso!',
          icon: 'success',
          text: `A marca ${this.brandForm.value.name} foi ${action} com sucesso.`,
          showConfirmButton: true,
          confirmButtonColor: '#19B6DD',
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            this.closeModal(); // Envia os dados atualizados ao fechar o modal
          }
        });
      });
    } else {
      console.warn('Formulário inválido:', this.brandForm);
    }
  }

  isEditing(): boolean {
    return !!this.data; // Retorna true se this.data estiver definido, indicando que estamos editando
  }

  closeModal() {
    this.dialogRef.close();
  }

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