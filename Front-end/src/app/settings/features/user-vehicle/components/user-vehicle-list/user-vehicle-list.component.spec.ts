import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UserVehicleListComponent } from './user-vehicle-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { UserVehicleService } from '../../../../core/services/user/uservehicle/user-vehicle.service';
import { AlertasService } from '../../../../core/services/Alertas/alertas.service';
import { UserVehicle } from '../../../../core/models/user-vehicle';
import { PaginatedResponse } from '../../../../core/models/paginatedResponse';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import 'jest-preset-angular/setup-jest';
import { Vehicle } from '../../../../core/models/vehicle';
import { HttpErrorResponse } from '@angular/common/http';

// Mocks de dados
const mockAlertasService = {
  showError: jest.fn(),
  showSuccess: jest.fn(),
  showWarning: jest.fn().mockResolvedValue(true), // Mock do showWarning
};

let mockUserVehicles: PaginatedResponse<UserVehicle> = {
  content: [
    { id: 1, userId: 101, vehicleId: 202, mileagePerLiterRoad: 14.5, mileagePerLiterCity: 12, consumptionEnergetic: 20, autonomyElectricMode: 80, batteryCapacity: 50, activated: true },
    { id: 2, userId: 102, vehicleId: 203, mileagePerLiterRoad: 15.0, mileagePerLiterCity: 13, consumptionEnergetic: 18, autonomyElectricMode: 100, batteryCapacity: 55, activated: true },
  ],  
  pageable: {
    pageNumber: 0,
    pageSize: 2,
    sort: {
      empty: false,
      sorted: false,
      unsorted: false,
    },
    offset: 0,
    paged: true,
    unpaged: false,
  },
  last: false,
  totalPages: 1,
  totalElements: 2,
  first: true,
  size: 2,
  number: 0,
  sort: { active: 'id', direction: 'asc' },
  numberOfElements: 2,
  empty: false,
};

// Mock da implementação do serviço
class MockUserVehicleService {
  listAll(pageIndex: number, pageSize: number) {
    return of({
      content: mockUserVehicles.content,
      totalElements: 2,
      totalPages: 1,
      size: pageSize,
      number: pageIndex,
      numberOfElements: 2,
      first: true,
      last: false,
      pageable: {
        pageSize: pageSize,
        pageNumber: pageIndex,
        offset: pageIndex * pageSize,
        paged: true,
        unpaged: false,
      },
      sort: {
        sorted: true,
        unsorted: false,
        empty: false,
      },
      empty: false,
    } as unknown as PaginatedResponse<UserVehicle>);
  }
}

describe('UserVehicleListComponent', () => {
  let component: UserVehicleListComponent;
  let fixture: ComponentFixture<UserVehicleListComponent>;
  let userVehicleService: UserVehicleService;
  let alertasService: AlertasService;
  let mockDialog: { open: jest.Mock };

  beforeEach(async () => {

    mockDialog = {
      open: jest.fn(), // Mock do método open
    };

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        NoopAnimationsModule,
      ],
      declarations: [UserVehicleListComponent],
      providers: [
        { provide: UserVehicleService, useClass: MockUserVehicleService },
        { provide: AlertasService, useValue: mockAlertasService },
        { provide: MatDialog, useValue: mockDialog },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserVehicleListComponent);
    component = fixture.componentInstance;
    userVehicleService = TestBed.inject(UserVehicleService);
    alertasService = TestBed.inject(AlertasService);
    fixture.detectChanges();
  });


  it('should call getList on component initialization', () => {
    const spy = jest.spyOn(component, 'getList');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith(component.currentPage, component.pageSize);
  });

  it('should handle page change correctly', () => {
    const spy = jest.spyOn(component, 'getList'); // Espiona o método getList
    component.onPageChange({ pageSize: 5, pageIndex: 1 }); // Simula a troca de página

    // Verifica se as variáveis foram atualizadas
    expect(component.pageSize).toBe(5);
    expect(component.currentPage).toBe(1);

    // Verifica se o método getList foi chamado corretamente
    expect(spy).toHaveBeenCalledWith(1, 5);
  });

  it('should correctly update page size and page index when paginated', (done) => {
    const spy = jest.spyOn(component, 'getList'); // Espiona o método getList

    // Simula a troca de página
    component.onPageChange({ pageIndex: 1, pageSize: 5 });

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(component.currentPage).toBe(1);  // Verifica se a página foi atualizada
      expect(component.pageSize).toBe(5);    // Verifica se o tamanho da página foi atualizado
      expect(spy).toHaveBeenCalledWith(1, 5); // Verifica se o método foi chamado corretamente
      done();
    });
  });


  it('should show no data when no filter matches', (done) => {
    fixture.detectChanges();  
    fixture.whenStable().then(() => {
      component.applyFilter({ target: { value: 'nonexistent filter' } } as unknown as Event);  // Filtro sem correspondências
      fixture.detectChanges();

      expect(component.filteredData.length).toBe(0);  // Verifica se o array filtrado está vazio
      done();
    });
  });

  it('should show error alert when initial load fails', fakeAsync(() => {
    jest.spyOn(userVehicleService, 'listAll').mockReturnValue(
      throwError(() => new HttpErrorResponse({
        error: { message: 'Erro ao carregar dados' }, // Propriedade `message` para simular a estrutura
        status: 500,
        statusText: 'Internal Server Error'
      }))
    );

    const errorSpy = jest.spyOn(mockAlertasService, 'showError');

    component.ngOnInit(); // Executa o método que faz o carregamento
    tick(); // Avança o tempo virtual para completar o observable

    expect(errorSpy).toHaveBeenCalledWith('Erro ao carregar endereços', 'Erro ao carregar dados');
  }));





  it('should correctly handle pagination with different page sizes', () => {
    component.onPageChange({ pageIndex: 0, pageSize: 10 }); // Simula uma página maior
    fixture.detectChanges();

    expect(component.pageSize).toBe(10); // Verifica o tamanho da página
    expect(component.currentPage).toBe(0); // Verifica a página atual
  });
  it('should show data correctly when load is successful', fakeAsync(() => {
    jest.spyOn(userVehicleService, 'listAll').mockReturnValue(of(mockUserVehicles)); // Simula um sucesso
  
    component.ngOnInit();
    tick(); // Avança o tempo virtual para completar o observable
  
    expect(component.userVehicleList).toEqual(mockUserVehicles.content); // Verifica se os dados foram carregados corretamente
  }));

  it('should update data when page is changed', fakeAsync(() => {
    jest.spyOn(userVehicleService, 'listAll').mockReturnValue(of(mockUserVehicles)); // Simula dados carregados
    component.onPageChange({ pageIndex: 1, pageSize: 10 }); // Simula mudança de página
    tick(); // Avança o tempo virtual para completar o observable
    expect(component.userVehicleList).toEqual(mockUserVehicles.content); // Verifica se os dados da página foram atualizados corretamente
  }));


  it('should show no data when no filter matches', fakeAsync(() => {
    fixture.detectChanges();
    const searchEvent = { target: { value: 'nonexistent' } }; // Filtro sem resultados
    const spy = jest.spyOn(component, 'applyFilter');
  
    component.applyFilter(searchEvent as unknown as Event); // Aplica o filtro
  
    fixture.detectChanges();
    tick(); // Avança o tempo do observable
  
    expect(spy).toHaveBeenCalledWith(searchEvent); // Verifica se a função applyFilter foi chamada
    expect(component.dataSource.data.length).toBe(0); // Verifica se não há resultados
  }));
  it('should navigate between pages correctly', fakeAsync(() => {
    const spy = jest.spyOn(component, 'getList');
    
    // Simula a mudança para a página 1
    component.onPageChange({ pageSize: 5, pageIndex: 1 });
    fixture.detectChanges();
    
    tick(); // Avança o tempo do observable
    
    expect(spy).toHaveBeenCalledWith(1, 5); // Verifica se o método getList foi chamado corretamente
  }));
  it('should show error alert when vehicle details request fails', fakeAsync(() => {
    const spy = jest.spyOn(userVehicleService, 'listAll').mockReturnValue(throwError(() => new HttpErrorResponse({
      error: { message: 'Falha ao carregar detalhes' },
      status: 500,
      statusText: 'Internal Server Error',
    })));
  
    const errorSpy = jest.spyOn(mockAlertasService, 'showError');
  
    component.getList(component.currentPage, component.pageSize); // Chama a função para obter os dados
    tick(); // Avança o tempo do observable
  
    expect(errorSpy).toHaveBeenCalledWith('Erro ao carregar endereços', 'Falha ao carregar detalhes');
  }));
  
  it('should handle empty data correctly', fakeAsync(() => {
    jest.spyOn(userVehicleService, 'listAll').mockReturnValue(of({ ...mockUserVehicles, content: [] })); // Mock com dados vazios
    
    component.ngOnInit(); // Executa o carregamento
    tick(); // Avança o tempo do observable
    
    expect(component.userVehicleList).toEqual([]); // Verifica se a lista foi atualizada corretamente
  }));
  
});
