import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalSelectAddressComponent } from './modal-select-address.component';
import { MatPaginatorModule, MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatDialogModule, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { AddressService } from '../../../../core/services/Address/address.service';
import { AlertasService } from '../../../../core/services/Alertas/alertas.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Subject, of, throwError } from 'rxjs';

// Mock do MatPaginatorIntl
class MockMatPaginatorIntl {
  itemsPerPageLabel = 'Itens por página';
  nextPageLabel = 'Próxima página';
  previousPageLabel = 'Página anterior';
  firstPageLabel = 'Primeira página';
  lastPageLabel = 'Última página';
  changes = new Subject<void>();
  getRangeLabel = (page: number, pageSize: number, length: number) => {
    return `${page * pageSize + 1}–${Math.min((page + 1) * pageSize, length)} de ${length}`;
  };
}

describe('ModalSelectAddressComponent', () => {
  let component: ModalSelectAddressComponent;
  let fixture: ComponentFixture<ModalSelectAddressComponent>;
  let mockAddressService: jest.Mocked<AddressService>;
  let mockAlertasService: jest.Mocked<AlertasService>;

  beforeEach(async () => {
    mockAddressService = {
      listAll: jest.fn().mockReturnValue(of({ content: [], totalElements: 0 })),
    } as unknown as jest.Mocked<AddressService>;

    mockAlertasService = {
      showError: jest.fn(),
    } as unknown as jest.Mocked<AlertasService>;

    await TestBed.configureTestingModule({
      declarations: [ModalSelectAddressComponent],
      imports: [
        MatDialogModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AddressService, useValue: mockAddressService },
        { provide: AlertasService, useValue: mockAlertasService },
        {
          provide: MatDialogRef,
          useValue: {
            close: () => {},
            afterClosed: () => new Subject(),
          },
        },
        { provide: MatDialog, useValue: { open: jest.fn() } },
        { provide: MatPaginatorIntl, useClass: MockMatPaginatorIntl },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalSelectAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should handle paginator labels correctly', () => {
    expect(component.paginator._intl.itemsPerPageLabel).toBe('Itens por página');
    const rangeLabel = component.paginator._intl.getRangeLabel(1, 10, 100);
    expect(rangeLabel).toBe('11–20 de 100');
  });

  it('should call AddressService.listAll with correct parameters', () => {
    component.getAllAddresses(1, 5);
    expect(mockAddressService.listAll).toHaveBeenCalledWith(1, 5);
  });

  it('should close the dialog', () => {
    const dialogRefSpy = jest.spyOn(component.dialogRef, 'close');
    component.closeModal();
    expect(dialogRefSpy).toHaveBeenCalled();
  });

  it('should handle error when loading addresses', () => {
    const error = new Error('Error loading addresses');
    mockAddressService.listAll.mockReturnValue(throwError(() => error));

    component.getAllAddresses(0, 3);

    expect(mockAddressService.listAll).toHaveBeenCalledWith(0, 3);
    expect(component.addresses?.data?.length).toBe(0);
    expect(component.total).toBe(0);
  });
});
