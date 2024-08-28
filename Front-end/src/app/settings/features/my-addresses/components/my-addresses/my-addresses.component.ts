import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { FaqPopupComponent } from '../../../../core/fragments/FAQ/faq-popup/faq-popup.component';
import { AddressService } from '../../../../core/services/Address/address.service';

@Component({
  selector: 'app-my-addresses',
  templateUrl: './my-addresses.component.html',
  styleUrl: './my-addresses.component.scss'
})
export class MyAddressesComponent implements
  OnInit {

  @Input() addressData: any = null; // Para reutilização em updates
  @Input() title: string = 'Registrar endereço'; // Para reutilização em updates

  addressForm: FormGroup;
  isLoading: boolean = false;
  labelPosition: "before" | "after" = "before";

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private adderessService: AddressService
  ) {
    this.addressForm = this.fb.group({
      country: [{ value: 'Brasil', disabled: true }, Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      state: [{ value: '', disabled: true }, Validators.required],
      city: [{ value: '', disabled: true }, Validators.required],
      district: ['', Validators.required],
      street: ['', Validators.required],
      number: ['', Validators.required],
      complement: [''],
      hasChargingStation: [false]
    });
  }

  ngOnInit() {
    if (this.addressData) {
      this.addressForm.patchValue(this.addressData);
    }
  }

  searchPostalCode() {
    this.isLoading = true;
    let postalCode = this.addressForm.get('postalCode')?.value;

    if (postalCode && postalCode.length === 8) {

      postalCode = postalCode.replace(/\D/g, ''); // Remove tudo o que não é número

      this.http.get(`https://viacep.com.br/ws/${postalCode}/json/`)
        .subscribe(
          (data: any) => {
            if (!data.erro) {
              this.addressForm.patchValue({
                state: data.uf,
                city: data.localidade,
                district: data.bairro,
                street: data.logradouro
              });
            } else {
              this.snackBar.open('CEP não encontrado', 'Fechar', { duration: 5000 });
            }
            this.isLoading = false;
          },
          error => {
            this.snackBar.open('Erro ao buscar CEP', 'Fechar', { duration: 5000 });
            this.isLoading = false;
          }
        );
    }
  }

  onSubmit() {
    if(this.addressData){
      this.update();
    }else{
      this.create();
    }

  }
  create() {
    if (this.addressForm.valid) {
      // Lógica para salvar ou atualizar o endereço
      console.log(this.addressForm.value);
      this.adderessService.createAddress(this.addressForm.value)
    }
  }

  update(){
    if (this.addressForm.valid) {
      // Lógica para salvar ou atualizar o endereço
      console.log(this.addressForm.value);
    }
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
