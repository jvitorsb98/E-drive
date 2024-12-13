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
import { IVehicleWithUserVehicle } from '../../../../core/models/vehicle-with-user-vehicle';
import { ModalFormVehicleComponent } from '../modal-form-vehicle/modal-form-vehicle.component';

// Mocks de dados
const mockAlertasService = {
  showError: jest.fn(),
  showSuccess: jest.fn(),
  showWarning: jest.fn().mockResolvedValue(true),
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
  deleteUserVehicle(id: number) {
    return of(undefined);
  }
}

describe('UserVehicleListComponent', () => {
  let component: UserVehicleListComponent;
  let fixture: ComponentFixture<UserVehicleListComponent>;
  let userVehicleService: UserVehicleService;
  let alertasService: AlertasService;
  let mockDialog: { open: jest.Mock };

  beforeEach(async () => {
    const mockUserVehicleService = {
      deleteUserVehicle: jest.fn()
    };
    mockDialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(true)),
      }),
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
    const spy = jest.spyOn(component, 'getList'); 
    component.onPageChange({ pageSize: 5, pageIndex: 1 }); 


    expect(component.pageSize).toBe(5);
    expect(component.currentPage).toBe(1);

    expect(spy).toHaveBeenCalledWith(1, 5);
  });

  it('should correctly update page size and page index when paginated', (done) => {
    const spy = jest.spyOn(component, 'getList'); 

    // Simula a troca de página
    component.onPageChange({ pageIndex: 1, pageSize: 5 });

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(component.currentPage).toBe(1); 
      expect(component.pageSize).toBe(5);   
      expect(spy).toHaveBeenCalledWith(1, 5); 
      done();
    });
  });


  it('should show no data when no filter matches', (done) => {
    fixture.detectChanges();  
    fixture.whenStable().then(() => {
      component.applyFilter({ target: { value: 'nonexistent filter' } } as unknown as Event);
      fixture.detectChanges();

      expect(component.filteredData.length).toBe(0);
      done();
    });
  });

  it('should show error alert when initial load fails', fakeAsync(() => {
    jest.spyOn(userVehicleService, 'listAll').mockReturnValue(
      throwError(() => new HttpErrorResponse({
        error: { message: 'Erro ao carregar dados' }, 
        status: 500,
        statusText: 'Internal Server Error'
      }))
    );

    const errorSpy = jest.spyOn(mockAlertasService, 'showError');

    component.ngOnInit();
    tick(); 

    expect(errorSpy).toHaveBeenCalledWith('Erro ao carregar endereços', 'Erro ao carregar dados');
  }));





  it('should correctly handle pagination with different page sizes', () => {
    component.onPageChange({ pageIndex: 0, pageSize: 10 }); 
    fixture.detectChanges();

    expect(component.pageSize).toBe(10);
    expect(component.currentPage).toBe(0); 
  });
  it('should show data correctly when load is successful', fakeAsync(() => {
    jest.spyOn(userVehicleService, 'listAll').mockReturnValue(of(mockUserVehicles)); 
  
    component.ngOnInit();
    tick(); 
  
    expect(component.userVehicleList).toEqual(mockUserVehicles.content); 
  }));

  it('should update data when page is changed', fakeAsync(() => {
    jest.spyOn(userVehicleService, 'listAll').mockReturnValue(of(mockUserVehicles));
    component.onPageChange({ pageIndex: 1, pageSize: 10 });
    tick(); 
    expect(component.userVehicleList).toEqual(mockUserVehicles.content); 
  }));


  it('should show no data when no filter matches', fakeAsync(() => {
    fixture.detectChanges();
    const searchEvent = { target: { value: 'nonexistent' } }; 
    const spy = jest.spyOn(component, 'applyFilter');
  
    component.applyFilter(searchEvent as unknown as Event);
  
    fixture.detectChanges();
    tick(); // Avança o tempo do observable
  
    expect(spy).toHaveBeenCalledWith(searchEvent);
    expect(component.dataSource.data.length).toBe(0);
  }));
  it('should navigate between pages correctly', fakeAsync(() => {
    const spy = jest.spyOn(component, 'getList');
    
    component.onPageChange({ pageSize: 5, pageIndex: 1 });
    fixture.detectChanges();
    
    tick();
    
    expect(spy).toHaveBeenCalledWith(1, 5); 
  }));
  it('should show error alert when vehicle details request fails', fakeAsync(() => {
    const spy = jest.spyOn(userVehicleService, 'listAll').mockReturnValue(throwError(() => new HttpErrorResponse({
      error: { message: 'Falha ao carregar detalhes' },
      status: 500,
      statusText: 'Internal Server Error',
    })));
  
    const errorSpy = jest.spyOn(mockAlertasService, 'showError');
  
    component.getList(component.currentPage, component.pageSize); 
    tick(); 
  
    expect(errorSpy).toHaveBeenCalledWith('Erro ao carregar endereços', 'Falha ao carregar detalhes');
  }));
  
  it('should handle empty data correctly', fakeAsync(() => {
    jest.spyOn(userVehicleService, 'listAll').mockReturnValue(of({ ...mockUserVehicles, content: [] })); 
    
    component.ngOnInit(); 
    tick(); 
    
    expect(component.userVehicleList).toEqual([]); 
  }));

  it('should call deleteUserVehicle and show success alert when deletion is confirmed', fakeAsync(() => {
    jest.spyOn(mockAlertasService, 'showWarning').mockResolvedValue(true); 
    const deleteSpy = jest.spyOn(userVehicleService, 'deleteUserVehicle').mockReturnValue(of(undefined)); 
    const successSpy = jest.spyOn(mockAlertasService, 'showSuccess');
  
    const vehicleData = { userVehicle: { id: 1 } } as IVehicleWithUserVehicle;
  
    component.deleteUserVehicle(vehicleData);
    tick();
  
    expect(deleteSpy).toHaveBeenCalledWith(1); 
    expect(successSpy).toHaveBeenCalledWith('Sucesso!', 'Veículo deletado com sucesso!');
  }));
  
  
  
  
  it('should not delete user vehicle if deletion is canceled', fakeAsync(() => {
    jest.spyOn(mockAlertasService, 'showWarning').mockResolvedValue(false);
    const deleteSpy = jest.spyOn(userVehicleService, 'deleteUserVehicle');
  
    component.deleteUserVehicle(mockUserVehicles.content[0] as unknown as IVehicleWithUserVehicle);
    tick();
  
    expect(deleteSpy).not.toHaveBeenCalled();
  }));
  
  
  it('should open modal for adding a new user vehicle', () => {
    const dialogSpy = jest.spyOn(mockDialog, 'open');
  
    component.openModalAddUserVehicle();
  
    expect(dialogSpy).toHaveBeenCalledWith(ModalFormVehicleComponent, {
      width: '80vw',
      height: '75vh',
      data: {}
    });
  });
  
  it('should update data correctly after adding a new vehicle', fakeAsync(() => {
    const spy = jest.spyOn(userVehicleService, 'listAll').mockReturnValue(of(mockUserVehicles)); 
    const dialogSpy = jest.spyOn(mockDialog, 'open').mockReturnValue({
      afterClosed: jest.fn().mockReturnValue(of(true))
    });
  
    component.openModalAddUserVehicle(); 
    tick(); 
  
    const newUserVehicle = { id: 3, userId: 103, vehicleId: 204, mileagePerLiterRoad: 16, mileagePerLiterCity: 14, consumptionEnergetic: 22, autonomyElectricMode: 110, batteryCapacity: 60, activated: true };
    mockUserVehicles.content.push(newUserVehicle); 
    fixture.detectChanges();
  
    expect(component.userVehicleList).toContain(newUserVehicle);
  }));
  it('should display no data when there are no vehicles', fakeAsync(() => {
    jest.spyOn(userVehicleService, 'listAll').mockReturnValue(of({ ...mockUserVehicles, content: [] }));
  
    component.ngOnInit(); 
    tick(); 
  
    expect(component.userVehicleList).toEqual([]); // Verifica se a lista está vazia
    expect(component.filteredData.length).toBe(0); // Verifica se a filtragem também está vazia
  }));
  /* it('should handle error during filter', fakeAsync(() => {
    // Mock do erro na chamada do service
    jest.spyOn(userVehicleService, 'listAll').mockReturnValue(throwError(() => new HttpErrorResponse({
      error: { message: 'Erro ao aplicar filtro' },
      status: 500,
      statusText: 'Internal Server Error',
    })));
  
    // Espiar o método showError do alertasService
    const errorSpy = jest.spyOn(mockAlertasService, 'showError');
  
    // Chamar o método applyFilter com evento mockado
    component.applyFilter({ target: { value: 'any' } } as unknown as Event);
    
    // Avançar o tempo para garantir que o erro seja tratado
    tick();
    
    // Verificar se o método showError foi chamado com a mensagem correta
    // Como o catchError trata o erro da API, o teste deve esperar o erro da API (erro.message) ser mostrado
    expect(errorSpy).toHaveBeenCalledWith('Erro !!', 'Erro ao aplicar filtro');
  })); */
  
  
  
  
  it('should call deleteUserVehicle and show success alert when deletion is confirmed', fakeAsync(() => {
    // Simula a confirmação de exclusão no alerta
    jest.spyOn(mockAlertasService, 'showWarning').mockResolvedValue(true); 

    const deleteSpy = jest.spyOn(userVehicleService, 'deleteUserVehicle').mockReturnValue(of(undefined)); 
    const successSpy = jest.spyOn(mockAlertasService, 'showSuccess');
    const vehicleData = { userVehicle: { id: 1 } } as IVehicleWithUserVehicle;
    
    component.deleteUserVehicle(vehicleData);
    tick(); 
    
    expect(deleteSpy).toHaveBeenCalledWith(1);
    expect(successSpy).toHaveBeenCalledWith('Sucesso!', 'Veículo deletado com sucesso!');
  }));
  
  it('should not delete user vehicle if deletion is canceled', fakeAsync(() => {
    jest.spyOn(mockAlertasService, 'showWarning').mockResolvedValue(false); 
    const deleteSpy = jest.spyOn(userVehicleService, 'deleteUserVehicle');
    
    component.deleteUserVehicle(mockUserVehicles.content[0] as unknown as IVehicleWithUserVehicle);
    tick();
    
    expect(deleteSpy).not.toHaveBeenCalled();
  }));
  
  it('should show error alert when deleteUserVehicle fails', fakeAsync(() => {
    jest.spyOn(mockAlertasService, 'showWarning').mockResolvedValue(true);
    
    const deleteSpy = jest.spyOn(userVehicleService, 'deleteUserVehicle').mockReturnValue(throwError(() => new HttpErrorResponse({
      error: { message: 'Erro ao excluir veículo' },
      status: 500,
      statusText: 'Internal Server Error',
    })));
    
    const errorSpy = jest.spyOn(mockAlertasService, 'showError');
    
    component.deleteUserVehicle({ userVehicle: { id: 1 } } as IVehicleWithUserVehicle);
    tick(); // Avança o tempo
  
    expect(errorSpy).toHaveBeenCalledWith('Erro!', 'Ocorreu um erro ao deletar o veículo. Tente novamente mais tarde.');
  }));
  
  
  it('should navigate and update data when multiple pages exist', fakeAsync(() => {
    const mockPaginatedResponse: PaginatedResponse<UserVehicle> = {
      ...mockUserVehicles,
      totalPages: 2,  // Simula duas páginas
      content: [{ id: 3, userId: 105, vehicleId: 208, mileagePerLiterRoad: 17, mileagePerLiterCity: 15, consumptionEnergetic: 25, autonomyElectricMode: 120, batteryCapacity: 70, activated: true }]
    };
  
    jest.spyOn(userVehicleService, 'listAll').mockReturnValue(of(mockPaginatedResponse));
  
    // Simula a mudança de página
    component.onPageChange({ pageIndex: 1, pageSize: 2 });
    tick();
  
    expect(component.userVehicleList.length).toBe(1); 
  }));
  
 /* it('should show no data message when the list is empty', fakeAsync(() => {
    jest.spyOn(userVehicleService, 'listAll').mockReturnValue(of({ ...mockUserVehicles, content: [] })); // Mock com dados vazios
    
    component.ngOnInit();
    tick();
    
    const noDataElement = fixture.debugElement.query(By.css('.no-data-message'));
    expect(noDataElement).toBeTruthy();  // Verifica se a mensagem "sem dados" é exibida
  })); 
  
  it('should handle error when adding a new vehicle via modal', fakeAsync(() => {
    const dialogSpy = jest.spyOn(mockDialog, 'open').mockReturnValue({
      afterClosed: jest.fn().mockReturnValue(of(false))  // Simula o cancelamento do modal
    });
  
    component.openModalAddUserVehicle();
    tick();
  
    expect(dialogSpy).toHaveBeenCalled();  // Verifica se o modal foi aberto
    expect(component.userVehicleList.length).toBe(2);  // Verifica se a lista não foi alterada
  }));*/
    
});
