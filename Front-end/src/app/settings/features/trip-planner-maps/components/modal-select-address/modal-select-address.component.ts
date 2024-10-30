import { Component, OnInit } from '@angular/core'; // Importa as classes do Angular
import { MatDialog, MatDialogRef } from '@angular/material/dialog'; // Importa classes para diálogos do Angular Material
import { AddressService } from '../../../../core/services/Address/address.service'; // Serviço para manipulação de endereços
import { DataAddressDetails, IAddressResponse } from '../../../../core/models/inter-Address'; // Modelos para dados de endereços
import { FaqPopupComponent } from '../../../../core/fragments/faq-popup/faq-popup.component'; // Componente para o popup de FAQ

/**
 * Componente para o modal de seleção de endereço.
 */
@Component({
  selector: 'app-modal-select-address', // Seletor do componente para uso em templates
  templateUrl: './modal-select-address.component.html', // Caminho para o template HTML
  styleUrls: ['./modal-select-address.component.scss'] // Caminho para os estilos do componente
})
export class ModalSelectAddressComponent implements OnInit { // Define a classe do componente implementando o ciclo de vida OnInit
  addresses: DataAddressDetails[] = []; // Lista para armazenar os endereços
  selectedAddress: IAddressResponse | null = null; // Endereço selecionado
  filteredAddresses: DataAddressDetails[] = []; // Lista para armazenar os endereços filtrados

  /**
   * Construtor do componente.
   * @param dialogRef - Referência ao diálogo para fechamento
   * @param dialog - Serviço para gerenciar diálogos
   * @param addressService - Serviço para manipulação de endereços
   */
  constructor(
    public dialogRef: MatDialogRef<ModalSelectAddressComponent>,
    private dialog: MatDialog,
    private addressService: AddressService
  ) { }

  /**
   * Método do ciclo de vida que é executado após a inicialização do componente.
   */
  ngOnInit(): void {
    this.getAllAddresses(); // Obtém todos os endereços ao inicializar o componente
  }

  /**
   * Método para obter todos os endereços do serviço.
   */
  getAllAddresses() {
    this.addressService.getAll().subscribe({
      next: (response) => {
        this.addresses = response.content; // Armazena os endereços recebidos
        console.log('Endereços do usuário:', this.addresses); // Log para verificar os endereços
      },
      error: (error) => {
        console.error('Erro ao buscar endereços:', error); // Tratamento de erro ao buscar endereços
      }
    });
  }

  /**
   * Método para aplicar filtro na lista de endereços.
   * @param event - Evento de teclado disparado ao digitar no campo de filtro
   */
  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase(); // Obtém o valor do filtro
    this.filteredAddresses = this.addresses.filter(address =>
      address.street.toLowerCase().includes(filterValue) || // Filtra pelos campos de endereço
      address.city.toLowerCase().includes(filterValue) ||
      address.state.toLowerCase().includes(filterValue)
    );
  }

  /**
   * Método para confirmar o endereço selecionado e fechar o diálogo.
   */
  confirmAddress(): void {
    if (this.selectedAddress) {
      this.dialogRef.close(this.selectedAddress); // Retorna o endereço selecionado
    }
  }

  /**
   * Método para cancelar a seleção e fechar o diálogo.
   */
  cancel(): void {
    this.dialogRef.close(); // Fecha o diálogo sem retornar dados
  }

  /**
   * Método para selecionar um endereço da lista.
   * @param address - Endereço a ser selecionado
   */
  onSelect(address: IAddressResponse): void {
    this.selectedAddress = address; // Define o endereço selecionado
  }

  /**
   * Método para abrir o modal de FAQ.
   */
  openFAQModal() {
    this.dialog.open(FaqPopupComponent, { // Abre o componente de FAQ
      data: {
        faqs: [] // Aqui você pode passar as FAQs que deseja exibir
      },
    });
  }
}
