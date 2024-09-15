import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { FaqPopupComponent } from '../../../../core/fragments/FAQ/faq-popup/faq-popup.component';
import { DataAddressDetails } from '../../../../core/models/inter-Address';
import { AddressService } from '../../../../core/services/Address/address.service';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { PaginatedResponse } from '../../../../core/models/paginatedResponse';
import { ModalDetailsAddressComponent } from '../modal-details-address/modal-details-address.component';
import { MyAddressesComponent } from '../my-addresses/my-addresses.component';
import Swal from 'sweetalert2';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-list-my-addresses',
  templateUrl: './list-my-addresses.component.html',
  styleUrl: './list-my-addresses.component.scss'
})
export class ListMyAddressesComponent implements OnInit {
  displayedColumns: string[] = ['icon', 'postalCode', 'city', 'state', 'actions'];
  dataSource = new MatTableDataSource<DataAddressDetails>();
  dataAddressDetails: DataAddressDetails[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private addressService: AddressService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource<DataAddressDetails>(this.dataAddressDetails);
  }

  ngOnInit() {
    this.loadAddresses();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
  }

  loadAddresses() {
    this.addressService.getAllAddresses().subscribe({
      next: (response: PaginatedResponse<DataAddressDetails>) => {
        console.log('Response from getAllAddresses:', response);

        // Extrai o array de endereços do campo 'content'
        const addressList = response.content;

        if (Array.isArray(addressList)) {
          this.dataSource.data = addressList;
        } else {
          console.error('Expected an array in response.content, but got:', addressList);
        }
      },
      error: (error) => {
        console.error('Error on loadAddresses:', error);
        this.snackBar.open('Erro ao carregar endereços', 'Fechar', { duration: 5000 });
      }
    });
  }

  addAddress() {
    this.addressService.selectAddress(null);
    this.addressService.setTitle('Registrar Endereço');
    this.router.navigate(['/new-address']);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  deleteAddress(address: DataAddressDetails) {
    Swal.fire({
      title: 'Tem certeza?',
      text: `Deseja realmente deletar o endereço? Esta ação não poderá ser desfeita.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#19B6DD',
      cancelButtonColor: '#ff6b6b',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Deletando endereço:', address);
        this.addressService.disable(address.id).pipe(
          catchError(() => {
            Swal.fire({
              title: 'Erro!',
              icon: 'error',
              text: 'Ocorreu um erro ao deletar o endereço. Tente novamente mais tarde.',
              showConfirmButton: true,
              confirmButtonColor: 'red'
            });
            return of(null);
          })
        ).subscribe(() => {
          Swal.fire({
            title: 'Sucesso!',
            icon: 'success',
            text: 'O endereço foi deletado com sucesso!',
            showConfirmButton: true,
            confirmButtonColor: '#19B6DD'
          }).then(() => {
            this.loadAddresses();
          });
        });
      }
    });
  }

  openModalDetailsAddress(address: DataAddressDetails) {
    this.dialog.open(ModalDetailsAddressComponent, {
      width: '80vw',
      height: '75vh',
      data: address
    })
  }
  openModalAddAddress() {
    this.dialog.open(MyAddressesComponent, {
      width: '80vw',
      height: '90vh',
      data: {
        actionTitle: 'Cadastrar Endereço'
      }
    }).afterClosed().subscribe(() => this.loadAddresses());
  }
  
  editAddress(address: DataAddressDetails) {
    this.dialog.open(MyAddressesComponent, {
      width: '80vw',
      height: '90vh',
      data: {
        addressData: address,
        actionTitle: 'Editar Endereço'
      }
    }).afterClosed().subscribe(() => {
      this.loadAddresses();
    });
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
