import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { FaqPopupComponent } from '../../../../core/fragments/FAQ/faq-popup/faq-popup.component';
import { AddressData, DataAddressDetails } from '../../../../core/models/inter-Address';
import { AddressService } from '../../../../core/services/Address/address.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-my-addresses',
  templateUrl: './list-my-addresses.component.html',
  styleUrl: './list-my-addresses.component.scss'
})
export class ListMyAddressesComponent implements OnInit {
  displayedColumns: string[] = ['postalCode', 'city', 'state', 'actions'];
  dataSource = new MatTableDataSource<DataAddressDetails>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private addressService: AddressService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAddresses();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadAddresses(page: number = 0, size: number = 10, sort: string = 'city') {
    this.addressService.getAllAddresses()
      .subscribe(
        (data: any) => {
          this.dataSource.data = data.content;
        },
        error => {
          this.snackBar.open('Erro ao carregar endereços', 'Fechar', { duration: 5000 });
        }
      );
  }

  openDetails(address: DataAddressDetails) {
    this.dialog.open(FaqPopupComponent, { // Ou crie um componente específico para exibir os detalhes
      width: '500px',
      data: {
        faqs: [
          { question: 'CEP', answer: address.zipCode },
          { question: 'País', answer: address.country },
          { question: 'Estado', answer: address.state },
          { question: 'Cidade', answer: address.city },
          { question: 'Bairro', answer: address.neighborhood },
          { question: 'Logradouro', answer: address.street },
          { question: 'Número', answer: address.number },
          { question: 'Complemento', answer: address.complement },
          { question: 'Ponto de recarga?', answer: address.hasChargingStation ? 'Sim' : 'Não' }
        ]
      }
    });
  }

  addAddress() {
    this.addressService.selectAddress(null);
    this.addressService.setTitle('Registrar Endereço');
    this.router.navigate(['/new-address']);
  }

  editAddress(address: DataAddressDetails) {

    this.addressService.selectAddress(address);

    this.addressService.setTitle('Editar Endereço');

    this.router.navigate(['/my-addresses/edit']);

  }

  deleteAddress(address: DataAddressDetails) {
    if (confirm('Tem certeza que deseja excluir este endereço?')) {
      this.addressService.disable(address.id)
        .subscribe(() => {
          this.loadAddresses();
          this.snackBar.open('Endereço excluído com sucesso!', 'Fechar', { duration: 5000 });
        });
    }
  }

  openFAQModal() {
    this.dialog.open(FaqPopupComponent, {
      data: {
        faqs: [
          {
            question: 'O que é o CEP?',
            answer: 'O CEP (Código de Endereçamento Postal) é um código numérico utilizado pelos Correios para identificar os logradouros no Brasil. Ele é essencial para que suas correspondências e encomendas sejam entregues corretamente.',
          }
        ]
      }
    }
    );
  }
}
