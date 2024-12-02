import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalSelectAddressComponent } from './modal-select-address.component';
import { MatPaginatorModule, MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AddressService } from '../../../../core/services/Address/address.service';
import { AlertasService } from '../../../../core/services/Alertas/alertas.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Subject } from 'rxjs';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalSelectAddressComponent],
      imports: [
        MatDialogModule,
        MatPaginatorModule,
        HttpClientTestingModule
      ],
      providers: [
        AddressService,
        AlertasService,
        {
          provide: MatDialogRef,
          useValue: {
            close: () => {},
            afterClosed: () => new Subject()
          }
        },
        { provide: MatPaginatorIntl, useClass: MockMatPaginatorIntl }  // Fornece o mock para MatPaginatorIntl
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSelectAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Assegura que a mudança foi refletida no template
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should spy on the _intl setter', () => {
    // Teste para garantir que os rótulos sejam configurados corretamente
    expect(component.paginator._intl.itemsPerPageLabel).toBe('Itens por página');
    
    // Testa o método getRangeLabel
    const rangeLabel = component.paginator._intl.getRangeLabel(1, 10, 100);
    expect(rangeLabel).toBe('11–20 de 100');
  });
});
