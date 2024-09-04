import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FaqPopupComponent } from '../../../../core/fragments/FAQ/faq-popup/faq-popup.component';
import { AddressService } from '../../../../core/services/Address/address.service';
import { IAddressRequest } from '../../../../core/models/inter-Address';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PostalCodeService } from '../../../../core/services/apis/postal-code/postal-code.service';

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
  address!: IAddressRequest;
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private postalCodeService: PostalCodeService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private addressService: AddressService,
    public dialogRef: MatDialogRef<MyAddressesComponent>,
    private router: Router,
    private activatRouter: ActivatedRoute
  ) {
    this.addressForm = this.fb.group({
      country: new FormControl('Brasil', Validators.required),
      zipCode: new FormControl('', [Validators.required]),
      state: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      neighborhood: new FormControl('', Validators.required),
      street: new FormControl('', Validators.required),
      number: new FormControl('', Validators.required),
      complement: new FormControl(''),
      hasChargingStation: new FormControl(false, Validators.requiredTrue),
    });
  }

  ngOnInit() {

    this.addressForm.get('zipCode')?.valueChanges.subscribe(value => {
      if (value && value.length === 8) {
        this.searchPostalCode();
      }
    });

    const addressSubscription = this.addressService.selectedAddress$.subscribe(data => {
      this.addressData = data;
    })

    const titleSubscription = this.addressService.selectedTitle$.subscribe(title => {
      this.title = title;
    });

    this.subscriptions.push(addressSubscription, titleSubscription);

    if (this.addressData) {
      this.addressForm.patchValue(this.addressData);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  searchPostalCode() {
    this.isLoading = true;
    let postalCode = this.addressForm.get('zipCode')?.value;

    if (postalCode && postalCode.length === 8) {
      this.postalCodeService.searchPostalCode(postalCode).subscribe({
        next: (data: any) => { // Sucesso: manipula os dados retornados
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
        error: () => { // Erro: manipula o erro ocorrido
          this.snackBar.open('Erro ao buscar CEP', 'Fechar', { duration: 5000 });
          this.isLoading = false;
        }
      });
    }
  }

  onSubmit() {
    if (this.addressData) {
      this.update();
    } else {
      this.create();
    }

  }
  create() {
    if (this.addressForm.valid) {
      // Lógica para salvar ou atualizar o endereço
      this.address = this.addressForm.value;

      this.addressService.createAddress(this.address)
        .subscribe(
          {
            next: () => {
              this.snackBar.open('Endereço criado com sucesso', 'Fechar', { duration: 5000 });
              this.addressForm.reset();
              this.router.navigate(['/meus-enderecos']);
            },
            error: () => {
              this.snackBar.open('Erro ao criar endereço', 'Fechar', { duration: 5000 });
            }
          }
        )
    }
  }

  update() {
    if (this.addressForm.valid) {
      // Lógica para salvar ou atualizar o endereço
      if (this.addressData) {
        this.address = this.addressForm.value as IAddressRequest;
        this.addressService.updateAddress(this.addressData.id, this.address).subscribe(
          {
            next: () => {
              this.snackBar.open('Endereço atualizado com sucesso', 'Fechar', { duration: 5000 });
              this.addressForm.reset();
              this.subscriptions.forEach(sub => sub.unsubscribe());
              this.router.navigate(['/meus-enderecos']);
            },
            error: () => {
              this.snackBar.open('Erro ao atualizar endereço', 'Fechar', { duration: 5000 });
            }
          }
        )
      }
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

  closeModal() {
    this.dialogRef.close();
  }
}
