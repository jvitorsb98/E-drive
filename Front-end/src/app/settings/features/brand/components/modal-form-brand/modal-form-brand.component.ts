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
            question: 'O que é o CEP?',
            answer: 'O CEP (Código de Endereçamento Postal) é um código numérico utilizado pelos Correios para identificar os logradouros no Brasil. Ele é essencial para que suas correspondências e encomendas sejam entregues corretamente.',
          },
          {
            question: 'Por que preciso preencher o CEP?',
            answer: 'Ao preencher o CEP, o sistema busca automaticamente as informações de endereço relacionadas, como estado, cidade, bairro e logradouro, agilizando o preenchimento do formulário e reduzindo a chance de erros.',
          },
          {
            question: 'O que acontece se eu digitar um CEP inválido?',
            answer: 'Se você digitar um CEP inválido ou inexistente, uma mensagem de erro será exibida e os campos de endereço não serão preenchidos automaticamente. Verifique se o CEP está correto e tente novamente.',
          },
          {
            question: 'Posso preencher os campos de endereço manualmente?',
            answer: 'Sim, você pode preencher os campos de endereço manualmente, caso prefira ou se o CEP não estiver disponível. No entanto, recomendamos utilizar a busca automática pelo CEP para garantir a precisão das informações.',
          },
          {
            question: 'O que significa o campo "Complemento"?',
            answer: 'O campo "Complemento" é opcional e serve para adicionar informações adicionais sobre o endereço, como número do apartamento, bloco, ponto de referência, etc. Utilize-o para tornar o endereço mais preciso e facilitar a entrega.',
          },
          {
            question: 'Por que alguns campos estão desabilitados?',
            answer: 'Alguns campos, como Estado, Cidade, Bairro e Logradouro, podem ser desabilitados após a busca pelo CEP. Isso ocorre porque o sistema preenche automaticamente esses campos com as informações obtidas da API de CEP, garantindo a consistência dos dados. Você pode editar esses campos manualmente, se necessário.',
          },
          {
            question: 'O que acontece quando eu clico em "Salvar"?',
            answer: 'Ao clicar em "Salvar", as informações do formulário serão enviadas para o sistema para serem processadas. O sistema pode utilizar essas informações para cadastrar um novo endereço, atualizar um endereço existente ou realizar outras ações, dependendo do contexto da aplicação.',
          }
        ]
      }
    }
    );
  }
}