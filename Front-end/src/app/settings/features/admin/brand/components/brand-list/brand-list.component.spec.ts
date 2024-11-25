import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BrandListComponent } from './brand-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockService } from 'ng-mocks';
import { BrandService } from '../../../../../core/services/brand/brand.service';
import { of, throwError } from 'rxjs'; // Inclua throwError para simular erros
import { By } from '@angular/platform-browser';
import { ModalDetailsBrandComponent } from '../modal-details-brand/modal-details-brand.component';
import { MatDialog } from '@angular/material/dialog';

describe('BrandListComponent', () => {
  let component: BrandListComponent;
  let fixture: ComponentFixture<BrandListComponent>;

  const mockBrandList = [
    { id: 1, name: 'Marca 1', activated: true },
    { id: 2, name: 'Marca 2', activated: false },
  ];

  let mockBrandService: any;
  let mockDialog: any;

  beforeEach(async () => {
    mockBrandService = MockService(BrandService, {
      getAllPaginated: jest.fn().mockReturnValue(of({ content: mockBrandList, totalElements: 2 })),
      delete: jest.fn().mockReturnValue(of(null))
    });

    mockDialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(true))
      })
    };

    await TestBed.configureTestingModule({
      declarations: [BrandListComponent],
      imports: [
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: BrandService, useValue: mockBrandService },
        { provide: MatDialog, useValue: mockDialog }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load brands on init', () => {
    component.loadBrands(0, 10);
    expect(component.brands.length).toBe(mockBrandList.length);
  });

  it('should handle error when loading brands', () => {
    (mockBrandService.getAllPaginated as jest.Mock).mockReturnValueOnce(throwError(() => new Error('Error loading brands')));

    component.loadBrands(0, 10);
    fixture.detectChanges();

    // Aqui você pode verificar se uma mensagem de erro é exibida no console ou se algum comportamento especial acontece no caso de erro
  });

  it('should filter the brand list based on user input', () => {
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    inputElement.value = 'Marca 1'; // Simula uma entrada de texto para filtro
    inputElement.dispatchEvent(new Event('keyup')); // Dispara o evento keyup
    component.dataSource.filter = inputElement.value.trim().toLowerCase(); // Define o filtro manualmente
    fixture.detectChanges();
  
    expect(component.dataSource.filteredData.length).toBe(1); // Apenas uma marca deve ser exibida
    expect(component.dataSource.filteredData[0].name).toBe('Marca 1');
  });
  

  it('should open view brand modal when view icon is clicked', () => {
    const brand = mockBrandList[0];
    component.openModalViewBrand(brand);

    expect(mockDialog.open).toHaveBeenCalledWith(ModalDetailsBrandComponent, expect.objectContaining({
      width: '300px',
      height: '230px',
      data: brand
    }));
  });
  it('should delete a brand and reload the list', fakeAsync(() => {
    const brand = mockBrandList[0];
  
    jest.spyOn(component, 'loadBrands'); // Espiona o método loadBrands
    jest.spyOn(mockBrandService, 'delete').mockReturnValue(of(null)); // Mock do método delete
    jest.spyOn(component['alertService'], 'showWarning').mockResolvedValue(true); // Mock do alerta com confirmação verdadeira
    jest.spyOn(component['alertService'], 'showSuccess').mockResolvedValue(true); // Mock do showSuccess
  
    component.disableBrand(brand);
  
    tick(); // Avança o tempo para resolver a promessa do showWarning
  
    // Avança o tempo novamente para resolver a promessa do showSuccess
    tick();
  
    expect(mockBrandService.delete).toHaveBeenCalledWith(brand.id); // Verifica se delete foi chamado com o ID correto
    expect(component.loadBrands).toHaveBeenCalledWith(component.pageIndex, component.pageSize); // Verifica se a lista foi recarregada
  }));
  
  

  it('should handle no brands found', () => {
    (mockBrandService.getAllPaginated as jest.Mock).mockReturnValue(of({ content: [], totalElements: 0 }));
    component.loadBrands(0, 10);

    expect(component.brands.length).toBe(0);
    expect(component.dataSource.data.length).toBe(0);
  });

  it('should reload brands after modal is closed', () => {
    jest.spyOn(component, 'loadBrands');

    component.openModalAddBrand();
    fixture.detectChanges();

    mockDialog.open().afterClosed().subscribe(() => {
      expect(component.loadBrands).toHaveBeenCalled();
    });

    component.openModalEditBrand(mockBrandList[0]);
    fixture.detectChanges();

    mockDialog.open().afterClosed().subscribe(() => {
      expect(component.loadBrands).toHaveBeenCalled();
    });
  });

  it('should display no data message when filter finds no matches', () => {
    const event = { target: { value: 'nonexistent' } } as unknown as Event;
    component.applyFilter(event);
    fixture.detectChanges();

    expect(component.dataSource.filteredData.length).toBe(0);

    const compiled = fixture.nativeElement;
    const noDataMessage = compiled.querySelector('.no-data');
    expect(noDataMessage).toBeTruthy();
    expect(noDataMessage.textContent).toContain('Não foram encontrados dados');
  });
});