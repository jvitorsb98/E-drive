import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrandListComponent } from './brand-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockService } from 'ng-mocks'; // Importar MockService
import { BrandService } from '../../../../../core/services/brand/brand.service'; // Importar o seu serviço de marcas
import { of } from 'rxjs'; // Importar `of` para simular retornos observáveis
import { By } from '@angular/platform-browser';
import { ModalDetailsBrandComponent } from '../modal-details-brand/modal-details-brand.component';
import { MatDialog } from '@angular/material/dialog';

describe('BrandListComponent', () => {
  let component: BrandListComponent;
  let fixture: ComponentFixture<BrandListComponent>;

  // Mock da lista de marcas
  const mockBrandList = [
    { id: 1, name: 'Marca 1', activated: true },
    { id: 2, name: 'Marca 2', activated: false },
  ];

  let mockBrandService: any;
  let mockDialog: any;
  

  beforeEach(async () => {
    mockBrandService = MockService(BrandService, {
      getAll: jest.fn().mockReturnValue(of({ content: mockBrandList })), // Mock do método getAll
      delete: jest.fn().mockReturnValue(of(null)) // Mock do método delete
    });
    mockDialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(true)) // Mock do comportamento após fechar o modal
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
    fixture.detectChanges(); // Inicializa a detecção de mudanças
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load brands on init', () => {
    component.loadBrands();
    expect(component.brandList.length).toBe(mockBrandList.length); // Verifica se as marcas foram carregadas
  });
  
  it('should handle error when loading brands', () => {
    const errorResponse = new Error('Error loading brands');
    (mockBrandService.getAll as jest.Mock).mockReturnValueOnce(of(errorResponse));
  
    component.loadBrands();
  
    // Verifique se o componente lidou com o erro conforme esperado
    // Isso depende de como seu componente está configurado para lidar com erros
  });

  it('should filter the brand list based on user input', () => {
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    inputElement.value = 'Marca 1'; // Simula uma entrada de texto para filtro
    inputElement.dispatchEvent(new Event('keyup')); // Dispara o evento keyup
    fixture.detectChanges();
  
    expect(component.dataSource.filter).toBe('marca 1');
    expect(component.dataSource.filteredData.length).toBe(1); // Apenas uma marca deve ser exibida
  });
  
  it('should open view brand modal when view icon is clicked', () => {
    const brand = mockBrandList[0]; // Pegue um item da lista de marcas
    
    component.openModalViewBrand(brand); // Chame o método que abre o modal
    
    // Verifique se o MatDialog.open foi chamado com os parâmetros corretos
    expect(mockDialog.open).toHaveBeenCalledWith(ModalDetailsBrandComponent, expect.objectContaining({
      width: '300px',
      height: '230px',
      data: brand
    }));
  });





  it('should open edit brand modal when edit icon is clicked', () => {
    const brand = mockBrandList[0];
  
    component.openModalEditBrand(brand); // Chama o método de edição
  
    // Verifica se o MatDialog.open foi chamado com os parâmetros corretos
    expect(mockDialog.open).toHaveBeenCalledWith(
      expect.any(Function), 
      expect.objectContaining({
        width: '500px',
        height: '210px',
        data: brand
      })
    );
  });
  
  it('should open add brand modal when add button is clicked', () => {
    component.openModalAddBrand();
  
    // Verifica se o MatDialog.open foi chamado com os parâmetros corretos
    expect(mockDialog.open).toHaveBeenCalledWith(
      expect.any(Function), 
      expect.objectContaining({
        width: '500px',
        height: '210px'
      })
    );
  });

  it('should set sort after view initialization', () => {
    component.ngAfterViewInit();
    expect(component.dataSource.sort).toBe(component.sort); // Verifica se a ordenação foi configurada corretamente
  });
  

  it('should delete a brand and reload the list', () => {
    const brand = mockBrandList[0];
  
    jest.spyOn(component, 'loadBrands'); // Espiona o método loadBrands
  
    component.disableBrand(brand);
  
    // Verifica se o método delete foi chamado corretamente
    expect(mockBrandService.delete).toHaveBeenCalledWith(brand.id);
  
    // Simula a resposta de exclusão
    mockDialog.open().afterClosed().subscribe(() => {
      expect(component.loadBrands).toHaveBeenCalled();
    });
  });
  
  
  it('should handle no brands found', () => {
    (mockBrandService.getAll as jest.Mock).mockReturnValue(of({ content: [] })); // Simula uma lista vazia
    component.loadBrands();
  
    expect(component.brandList.length).toBe(0); // Verifica se a lista está vazia
    expect(component.dataSource.data.length).toBe(0); // Verifica se a fonte de dados da tabela também está vazia
  });
  

  it('should show all brands if no filter is applied', () => {
    const event = { target: { value: '' } } as unknown as Event;
  
    component.applyFilter(event); // Aplica o filtro vazio
  
    // Verifica se todos os itens são exibidos
    expect(component.dataSource.filteredData.length).toBe(mockBrandList.length);
  });
  
  it('should reload brands after modal is closed', () => {
    jest.spyOn(component, 'loadBrands'); // Espiona o método loadBrands
  
    // Simula o fechamento do modal de adição
    component.openModalAddBrand();
    mockDialog.open().afterClosed().subscribe(() => {
      expect(component.loadBrands).toHaveBeenCalled();
    });
  
    // Simula o fechamento do modal de edição
    component.openModalEditBrand(mockBrandList[0]);
    mockDialog.open().afterClosed().subscribe(() => {
      expect(component.loadBrands).toHaveBeenCalled();
    });
  });
  it('should display no data message when filter finds no matches', () => {
    const event = { target: { value: 'nonexistent' } } as unknown as Event;
  
    component.applyFilter(event); // Aplica um filtro que não retorna nenhuma marca
    fixture.detectChanges(); // Dispara a detecção de mudanças para refletir o novo estado
  
    // Verifica se a tabela está vazia
    expect(component.dataSource.filteredData.length).toBe(0);
  
    // Verifica se a mensagem "Não foram encontrados dados" é exibida
    const compiled = fixture.nativeElement;
    const noDataMessage = compiled.querySelector('.no-data');
    expect(noDataMessage).toBeTruthy(); // Verifica se o elemento foi renderizado
    expect(noDataMessage.textContent).toContain('Não foram encontrados dados');
  });
  
  
  
});


