import { AlertasService } from '../../../../core/services/Alertas/alertas.service';
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
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-my-addresses-form',
  templateUrl: './modal-form-my-addresses.component.html',
  styleUrl: './modal-form-my-addresses.component.scss'
})
export class ModalFormMyAddressesComponent  implements OnInit {

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
    public dialogRef: MatDialogRef<ModalFormMyAddressesComponent>, // Referência ao diálogo do componente
    private router: Router, // Serviço para navegação e manipulação de rotas
    private alertasService: AlertasService,
    @Inject(MAT_DIALOG_DATA) public data: { addressData: DataAddressDetails; actionTitle: string } // Dados passados ao diálogo
  ) {
    // Inicializa o formulário com controles e validações
    this.addressForm = this.fb.group({
      country: new FormControl('Brasil', Validators.required), // Campo obrigatório para o país
      zipCode: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]), // Campo obrigatório para o CEP
      state: new FormControl('', Validators.required), // Campo obrigatório para o estado
      city: new FormControl('', Validators.required), // Campo obrigatório para a cidade
      neighborhood: new FormControl('', Validators.required), // Campo obrigatório para o bairro
      street: new FormControl('', Validators.required), // Campo obrigatório para a rua
      number: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9A-Za-z-]+$')]), // Campo obrigatório para o número
      complement: new FormControl(''), // Campo opcional para complemento
      hasChargingStation: new FormControl(false), // Campo para indicar se há estação de carregamento
    });

    // Configura o título da ação e preenche o formulário com dados, se disponíveis
    this.actionTitle = data.actionTitle;
    if (data.addressData) {
      this.addressForm.patchValue(data.addressData);
    }
  }

  /**
   * Inscreve-se em mudanças no campo 'zipCode' para buscar o CEP automaticamente,
   * e também inscreve-se para receber dados do endereço selecionado e do título,
   * salvando as inscrições para gerenciamento.
   */
  ngOnInit() {
    // Inscreve-se em mudanças no campo 'zipCode' para buscar o CEP automaticamente
    this.addressForm.get('zipCode')?.valueChanges.subscribe(value => {
      if (value && value.length === 8) {
        this.searchPostalCode();
      }
    });
  }

  /**
   * Busca o endereço a partir do CEP informado.
   *
   * Verifica se o CEP informado é válido e, se sim, busca as informações do
   * endereço no serviço de CEP. Caso o CEP seja inválido, exibe uma mensagem de
   * erro.
   *
   * Se o CEP for encontrado, atualiza o formulário com as informações do
   * endereço.
   *
   * @returns void
   */
  searchPostalCode() {
    // Define o estado de carregamento
    this.isLoading = true;
    const postalCode = this.addressForm.get('zipCode')?.value;

    // Verifica se o CEP é válido
    if (postalCode && postalCode.length === 8) {
      this.postalCodeService.searchPostalCode(postalCode).subscribe({
        next: (data: any) => {
          if (!data.erro) {
            // Obtém os valores atuais do formulário
            const currentFormValue = this.addressForm.value;

            // Mantém os valores atuais se os campos retornados pela API forem vazios
            const state = data.uf || currentFormValue.state;
            const city = data.localidade || currentFormValue.city;
            const neighborhood = data.bairro || currentFormValue.neighborhood;
            const street = data.logradouro || currentFormValue.street;

            // Atualiza o formulário com os novos valores
            this.addressForm.patchValue({
              state,
              city,
              neighborhood,
              street
            });
          } else {
            this.alertasService.showError('CEP não encontrado!', 'O CEP informado não existe na base de dados.');
          }
        },
        error: (erro: HttpErrorResponse) => {
          this.alertasService.showError('Erro ao buscar CEP!', erro.error.message);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
      this.alertasService.showError('CEP inválido!', 'O CEP deve conter 8 caracteres. Verifique o valor informado.');
    }
  }



  /**
   * Método responsável por controlar o fluxo de criação ou edição de endereços.
   * Caso haja dados de endereço, o método edit() será chamado. Caso contrário,
   * o método create() será chamado.
   */
  onSubmit() {
    // Verifica se há dados de endereço para decidir entre criar ou atualizar
    if (this.data.addressData) {
      this.edit();
    } else {
      this.create();
    }
  }

  /**
   * Cria um novo endereço se o formulário for válido
   * Chama o serviço de endereços para criar um novo endereço
   * com base nos dados do formulário
   * Se a requisição for bem-sucedida,
   * exibe uma mensagem de sucesso e fecha o modal
   * Senão, exibe uma mensagem de erro
   */
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


  /**
   * Atualiza um endereço existente se o formulário for válido
   * Chama o serviço de endereços para atualizar um endereço
   * com base nos dados do formulário
   * Se a requisição for bem-sucedida,
   * exibe uma mensagem de sucesso e fecha o modal
   * Senão, exibe uma mensagem de erro
   */
  edit() {
    // Atualiza um endereço existente se o formulário for válido
    if (this.addressForm.valid) {
      if (this.data.addressData) {
        this.addressService.update(this.data.addressData.id, this.addressForm.value).subscribe({
          next: () => {
            this.alertasService.showSuccess('Atualização de endereço !!', 'Endereço atualizado com sucesso!').then(() => {
              this.addressForm.reset();
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

  /**
   * Abre o modal com FAQs para fornecer informações adicionais ao usuário
   *
   * O modal exibe uma lista de perguntas frequentes e suas respostas,
   * como por exemplo, o que é o CEP, por que é necessário preencher o CEP,
   * entre outros.
   */
  openFAQModal() {
    // Abre o modal com FAQs para fornecer informações adicionais ao usuário
    this.dialog.open(FaqPopupComponent, {
      width: '500px',
      data: {
        faqs: [
          {
            question: 'Como preencher o CEP?',
            answer: 'Digite o CEP no formato 00000-000. O sistema buscará automaticamente o endereço quando você sair do campo.'
          },
          {
            question: 'Qual é o formato esperado para o número?',
            answer: 'O número deve conter apenas letras, números e hífens. Não utilize caracteres especiais.'
          },
          {
            question: 'Como corrijo um erro de campo obrigatório?',
            answer: 'Certifique-se de preencher todos os campos obrigatórios indicados com * antes de enviar o formulário.'
          },
          {
            question: 'O que fazer se o endereço não for encontrado?',
            answer: 'Verifique se o CEP foi digitado corretamente. Caso o problema persista, complete manualmente os campos de endereço.'
          },
          {
            question: 'Como adicionar um ponto de recarga para veículos elétricos?',
            answer: 'Marque a caixa "Possui ponto de recarga para veículo elétrico" para indicar a presença de uma estação de recarga.'
          },
          {
            question: 'Posso enviar o formulário com campos em branco?',
            answer: 'Não. Todos os campos obrigatórios devem ser preenchidos para habilitar o botão de finalização.'
          },
          {
            question: 'Como posso atualizar meu endereço?',
            answer: 'Altere as informações nos campos desejados e clique no botão "Finalizar" para salvar as atualizações.'
          }
        ]
      }
    });
  }

  closeModal() {
    // Fecha o modal atual
    this.dialogRef.close();
  }
}
