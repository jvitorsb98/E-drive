import { AlertasService } from './../../../../core/services/Alertas/alertas.service';
// Importa o decorador Component, a função Inject, o decorador Input e o ciclo de vida OnInit do Angular core
import { Component, Inject, Input, OnInit } from '@angular/core';

// Importa as classes FormBuilder, FormControl, FormGroup e Validators para construção e validação de formulários
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

// Importa MatSnackBar para exibir mensagens de feedback ao usuário
import { MatSnackBar } from '@angular/material/snack-bar';

// Importa MAT_DIALOG_DATA, MatDialog e MatDialogRef para manipulação de diálogos
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

// Importa o componente FaqPopupComponent para exibir FAQs em um modal
import { FaqPopupComponent } from '../../../../core/fragments/faq-popup/faq-popup.component';

// Importa o serviço AddressService para operações relacionadas a endereços
import { AddressService } from '../../../../core/services/Address/address.service';

// Importa o serviço PostalCodeService para buscar informações de CEP
import { PostalCodeService } from '../../../../core/services/apis/postal-code/postal-code.service';

// Importa DataAddressDetails e IAddressRequest para definição dos tipos de dados de endereço
import { DataAddressDetails, IAddressRequest } from '../../../../core/models/inter-Address';

// Importa ActivatedRoute e Router para manipulação de rotas e navegação
import { ActivatedRoute, Router } from '@angular/router';

// Importa Subscription para gerenciar inscrições em observáveis
import { Subscription } from 'rxjs';

// Importa Swal para exibir alertas e notificações bonitos
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

// Define o componente 'MyAddressesComponent'
@Component({
  selector: 'app-my-addresses', // Seletor para o componente
  templateUrl: './my-addresses.component.html', // Caminho para o template HTML
  styleUrls: ['./my-addresses.component.scss'] // Caminho para os estilos SCSS
})
export class MyAddressesComponent implements OnInit {

  // Input que pode ser passado de um componente pai, usado para reutilização em atualizações
  @Input() addressData: any = null;

  // Input que define o título para o formulário, utilizado em atualizações
  @Input() title: string = 'Registrar endereço';

  // Formulário para manipulação dos dados de endereço
  addressForm: FormGroup;

  // Indicador de carregamento durante a busca de CEP
  isLoading: boolean = false;

  // Define a posição do rótulo no formulário
  labelPosition: "before" | "after" = "before";

  // Dados do endereço a serem manipulados
  address!: IAddressRequest;

  // Flag para indicar se está no modo de edição
  editAddress: boolean = false;

  // Título da ação que está sendo realizada
  actionTitle: string = "";

  // Lista de inscrições em observáveis para gerenciar a limpeza
  private subscriptions: Subscription[] = [];

  // Construtor do componente
  constructor(
    private fb: FormBuilder, // Serviço para construir o formulário
    private postalCodeService: PostalCodeService, // Serviço para buscar informações de CEP
    private snackBar: MatSnackBar, // Serviço para exibir mensagens de feedback
    private dialog: MatDialog, // Serviço para abrir diálogos
    private addressService: AddressService, // Serviço para operações com endereços
    public dialogRef: MatDialogRef<MyAddressesComponent>, // Referência ao diálogo do componente
    private router: Router, // Serviço para navegação e manipulação de rotas
    private alertasService: AlertasService,
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

    //TODO: concertar o campo de complemento

    //Inscreve-se para receber dados do endereço selecionado e do título
    const addressSubscription = this.addressService.selectedAddress$.subscribe(data => {
      this.addressData = data;
      if (this.addressData) {
        this.addressForm.patchValue(this.addressData);
      }
    });

    const titleSubscription = this.addressService.selectedTitle$.subscribe(title => {
      this.title = title;
    });

    // Adiciona as inscrições à lista para gerenciamento
    this.subscriptions.push(addressSubscription, titleSubscription);
  }

  ngOnDestroy() {
    // Limpa as inscrições para evitar vazamentos de memória
    this.subscriptions.forEach(sub => sub.unsubscribe());
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
            this.alertasService.showError('CEP não encontrado!', 'O CEP informado não foi encontrado. Verifique se o CEP está correto e tente novamente.');
          }
          // Atualiza o estado de carregamento
          this.isLoading = false;
        },
        error: (erro: HttpErrorResponse) => {
          // Mensagem de erro se houver falha na requisição
          this.alertasService.showError('Erro ao buscar CEP!', erro.error.message);
        },
        complete: () => {
          // Atualiza o estado de carregamento ao finalizar a requisição
          this.isLoading = false;
        }
      });
    } else {
      // Caso o CEP não seja válido (diferente de 8 caracteres)
      this.isLoading = false;
      this.alertasService.showError('CEP inválido!', 'O CEP deve conter 8 caracteres. Verifique o valor informado.');
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
          this.alertasService.showSuccess('Criação de endereço', 'Endereço criado com sucesso!').then(() => {
            this.addressForm.reset();
            this.closeModal();
            this.router.navigate(['/meus-enderecos']);
          });
        },
        error: (erro: HttpErrorResponse) => {
          this.alertasService.showError('Erro ao criar endereço !!', erro.error.message);
        }
      });
    }
  }


  edit() {
    // Atualiza um endereço existente se o formulário for válido
    if (this.addressForm.valid) {
      if (this.data.addressData) {
        this.addressService.update(this.data.addressData.id, this.addressForm.value).subscribe({
          next: () => {
            this.alertasService.showSuccess('Atualização de endereço !!', 'Endereço atualizado com sucesso!').then(() => {
              this.addressForm.reset();
              this.subscriptions.forEach(sub => sub.unsubscribe());
              this.closeModal();
            })
          },
          error: (erro: HttpErrorResponse) => {
            this.alertasService.showError('Atualização de endereço falhou', erro.error.message || 'Erro inesperado');
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
