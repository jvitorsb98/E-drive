// Importa o decorador Component, a função Inject, o decorador Input e o ciclo de vida OnInit do Angular core
import { Component, Inject, Input, OnInit } from '@angular/core';

// Importa as classes FormBuilder, FormControl, FormGroup e Validators para construção e validação de formulários
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

// Importa MAT_DIALOG_DATA, MatDialog e MatDialogRef para manipulação de diálogos
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

// Importa o componente FaqPopupComponent para exibir FAQs em um modal
import { FaqPopupComponent } from '../../../../core/fragments/faq-popup/faq-popup.component';

// Importa o serviço AddressService para operações relacionadas a endereços
import { AddressService } from '../../../../core/services/Address/address.service';

// Importa o serviço PostalCodeService para buscar informações de CEP
import { PostalCodeService } from '../../../../core/services/apis/postal-code/postal-code.service';

// Importa DataAddressDetails e IAddressRequest para definição dos tipos de dados de endereço
import { DataAddressDetails } from '../../../../core/models/inter-Address';

// Importa ActivatedRoute e Router para manipulação de rotas e navegação
import { ActivatedRoute, Router } from '@angular/router';

// Importa Swal para exibir alertas e notificações bonitos
import Swal from 'sweetalert2';

// Define o componente 'MyAddressesComponent'
@Component({
  selector: 'app-my-addresses', // Seletor para o componente
  templateUrl: './my-addresses.component.html', // Caminho para o template HTML
  styleUrls: ['./my-addresses.component.scss'] // Caminho para os estilos SCSS
})
export class MyAddressesComponent implements OnInit {

  // Input que pode ser passado de um componente pai, usado para reutilização em atualizações
  @Input() addressData: any = null;

  // Formulário para manipulação dos dados de endereço
  addressForm: FormGroup;

  // Indicador de carregamento durante a busca de CEP
  isLoading: boolean = false;

  // Flag para indicar se está no modo de edição
  editAddress: boolean = false;

  // Título da ação que está sendo realizada
  actionTitle: string = "";

  // Construtor do componente
  constructor(
    private fb: FormBuilder, // Serviço para construir o formulário
    private postalCodeService: PostalCodeService, // Serviço para buscar informações de CEP
    private dialog: MatDialog, // Serviço para abrir diálogos
    private addressService: AddressService, // Serviço para operações com endereços
    public dialogRef: MatDialogRef<MyAddressesComponent>, // Referência ao diálogo do componente
    private router: Router, // Serviço para navegação e manipulação de rotas
    @Inject(MAT_DIALOG_DATA) public data: { addressData: DataAddressDetails; actionTitle: string } // Dados passados ao diálogo
  ) {
    // Inicializa o formulário com controles e validações
    this.addressForm = this.fb.group({
      country: new FormControl('Brasil', Validators.required), // Campo obrigatório para o país
      zipCode: new FormControl('', [Validators.required]), // Campo obrigatório para o CEP
      state: new FormControl('', Validators.required), // Campo obrigatório para o estado
      city: new FormControl('', Validators.required), // Campo obrigatório para a cidade
      neighborhood: new FormControl('', Validators.required), // Campo obrigatório para o bairro
      street: new FormControl('', Validators.required), // Campo obrigatório para a rua
      number: new FormControl('', Validators.required), // Campo obrigatório para o número
      complement: new FormControl(''), // Campo opcional para complemento
      hasChargingStation: new FormControl(false), // Campo para indicar se há estação de carregamento
    });

    // Configura o título da ação e preenche o formulário com dados, se disponíveis
    this.actionTitle = data.actionTitle;
    if (data.addressData) {
      this.addressForm.patchValue(data.addressData);
    }
  }

  ngOnInit() {
    // Inscreve-se em mudanças no campo 'zipCode' para buscar o CEP automaticamente
    this.addressForm.get('zipCode')?.valueChanges.subscribe(value => {
      if (value && value.length === 8) {
        this.searchPostalCode();
      }
    });
  }

  searchPostalCode() {
    // Define o estado de carregamento
    this.isLoading = true;
    const postalCode = this.addressForm.get('zipCode')?.value;

    // Verifica se o CEP é válido
    if (postalCode && postalCode.length === 8) {
      this.postalCodeService.searchPostalCode(postalCode).subscribe({
        next: (data: any) => {
          if (!data.erro) {
            // Atualiza o formulário com os dados do CEP
            this.addressForm.patchValue({
              state: data.uf,
              city: data.localidade,
              neighborhood: data.bairro,
              street: data.logradouro
            });
          } else {
            // Mensagem se o CEP não for encontrado
            this.showError('CEP não encontrado!', 'O CEP informado não foi encontrado. Verifique se o CEP está correto e tente novamente.');
          }
        },
        error: () => {
          // Mensagem de erro se houver falha na requisição
          this.showError('Erro ao buscar CEP!', 'Houve um problema ao buscar o CEP. Tente novamente mais tarde.');
        },
        complete: () => {
          // Atualiza o estado de carregamento ao finalizar a requisição
          this.isLoading = false;
        }
      });
    } else {
      // Caso o CEP não seja válido (diferente de 8 caracteres)
      this.isLoading = false;
      this.showError('CEP inválido!', 'O CEP deve conter 8 caracteres. Verifique o valor informado.');
    }
  }

  onSubmit() {
    // Verifica se há dados de endereço para decidir entre criar ou atualizar
    if (this.data.addressData) {
      this.edit();
    } else {
      this.create();
    }
  }

  create() {
    // Cria um novo endereço se o formulário for válido
    if (this.addressForm.valid) {
      this.addressService.register(this.addressForm.value).subscribe({
        next: () => {
          Swal.fire({
            title: 'Endereço criado com sucesso!',
            icon: 'success',
            text: 'O endereço foi criado com sucesso.',
            showConfirmButton: true,
            confirmButtonColor: '#19B6DD',
          }).then(() => {
            this.addressForm.reset();
            this.closeModal();
            this.router.navigate(['e-driver/users/my-addresses']);
          });
        },
        error: () => {
          Swal.fire({
            title: 'Erro ao criar endereço!',
            icon: 'error',
            text: 'Houve um problema ao criar o endereço. Tente novamente mais tarde.',
            showConfirmButton: true,
            confirmButtonColor: 'red',
          });
        }
      });
    }
  }

  // Função reutilizável para exibir os alertas de erro
  showError(title: string, message: string) {
    Swal.fire({
      title,
      icon: 'error',
      text: message,
      showConfirmButton: true,
      confirmButtonColor: '#19B6DD'
    });
  }

  edit() {
    // Atualiza um endereço existente se o formulário for válido
    if (this.addressForm.valid) {
      if (this.data.addressData) {
        this.addressService.update(this.data.addressData.id, this.addressForm.value).subscribe({
          next: () => {
            Swal.fire({
              title: 'Endereço editado com sucesso!',
              icon: 'success',
              text: 'O endereço foi editado com sucesso.',
              showConfirmButton: true,
              confirmButtonColor: '#19B6DD',
            }).then(() => {
              this.addressForm.reset();
              this.closeModal();
              this.router.navigate(['e-driver/users/my-addresses']);
            });
          },
          error: () => {
            Swal.fire({
              title: 'Erro ao criar editar!',
              icon: 'error',
              text: 'Houve um problema ao editar o endereço. Tente novamente mais tarde.',
              showConfirmButton: true,
              confirmButtonColor: 'red',
            });
          }
        });
      }
    }
  }

  openFAQModal() {
    // Abre o modal com FAQs para fornecer informações adicionais ao usuário
    this.dialog.open(FaqPopupComponent, {
      data: {
        faqs: [
          {
            question: 'O que é o CEP?',
            answer: 'O CEP (Código de Endereçamento Postal) é um código numérico utilizado pelos Correios para identificar os logradouros no Brasil. Ele é essencial para que suas correspondências e encomendas sejam entregues corretamente.',
          },
          {
            question: 'Por que preciso preencher o CEP?',
            answer: 'Ao preencher o CEP, o sistema busca automaticamente as informações de endereço relacionadas, como cidade, estado e bairro, facilitando o preenchimento do formulário e garantindo a precisão dos dados.',
          },
        ]
      }
    });
  }

  closeModal() {
    // Fecha o modal atual
    this.dialogRef.close();
  }
}
