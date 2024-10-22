import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AddressService } from '../../../../core/services/Address/address.service';
import { DataAddressDetails, IAddressResponse } from '../../../../core/models/inter-Address';
import { FaqPopupComponent } from '../../../../core/fragments/faq-popup/faq-popup.component';

@Component({
  selector: 'app-modal-select-address',
  templateUrl: './modal-select-address.component.html',
  styleUrls: ['./modal-select-address.component.scss']
})
export class ModalSelectAddressComponent implements OnInit {
  addresses: DataAddressDetails[] = []; // Lista para armazenar os endereços
  selectedAddress: IAddressResponse | null = null;
  filteredAddresses: DataAddressDetails[] = []; // Lista para armazenar os endereços filtrados

  constructor(
    public dialogRef: MatDialogRef<ModalSelectAddressComponent>,
    private dialog: MatDialog,
    private addressService: AddressService
  ) {}

  ngOnInit(): void {
    this.getAllAddresses();
  }

  getAllAddresses() {
    this.addressService.getAll().subscribe({
      next: (response) => {
        this.addresses = response.content;
        console.log('Endereços do usuário:', this.addresses); // Para verificar os endereços
      },
      error: (error) => {
        console.error('Erro ao buscar endereços:', error);
      }
    });
  }

  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredAddresses = this.addresses.filter(address =>
      address.street.toLowerCase().includes(filterValue) ||
      address.city.toLowerCase().includes(filterValue) ||
      address.state.toLowerCase().includes(filterValue)
    );
  }


  confirmAddress(): void {
    if (this.selectedAddress) {
      this.dialogRef.close(this.selectedAddress);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  onSelect(address: IAddressResponse): void {
    this.selectedAddress = address;
  }

  openFAQModal() {
    this.dialog.open(FaqPopupComponent, {
      data: {
        faqs: [

        ]
      },
    });
  }

}
