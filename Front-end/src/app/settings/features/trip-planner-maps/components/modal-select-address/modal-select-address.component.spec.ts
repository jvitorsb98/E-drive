import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { ModalSelectAddressComponent } from './modal-select-address.component';
import { AddressService } from '../../../../core/services/Address/address.service';
import { AlertasService } from '../../../../core/services/Alertas/alertas.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';


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
      providers: [
        { provide: AddressService, useValue: mockAddressService },
        { provide: AlertasService, useValue: mockAlertasService },
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
        { provide: MatDialog, useValue: { open: jest.fn() } },
      ],
      imports: [MatPaginatorModule, MatSortModule, MatTableModule], // Adicione aqui
    }).compileComponents();
    

    fixture = TestBed.createComponent(ModalSelectAddressComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

 
  it('should filter addresses', () => {
    const applyFilterSpy = jest.spyOn(component, 'applyFilter');  
    component.applyFilter({} as Event);
    expect(applyFilterSpy).toHaveBeenCalled();
  });

 
  
  it('should handle error when loading addresses', () => {
    const error = new Error('Error loading addresses');
    mockAddressService.listAll.mockReturnValue(throwError(() => error));

    component.getAllAddresses(0, 3);

    expect(mockAddressService.listAll).toHaveBeenCalledWith(0, 3);
    expect(component.addresses.data.length).toBe(0);
    expect(component.total).toBe(0);
  })

 
  
  it('should close the dialog', () => {
    const dialogRefSpy = jest.spyOn(component.dialogRef, 'close');
  
    component.closeModal();
  
    expect(dialogRefSpy).toHaveBeenCalled();
  });
  
 

  
  it('should close the dialog when closeModal is called', () => {
    // Arrange
    const dialogRefSpy = jest.spyOn(component.dialogRef, 'close');
    
    // Act
    component.closeModal();
    
    // Assert
    expect(dialogRefSpy).toHaveBeenCalled();
  });
   
  it('should call AddressService.listAll with correct parameters', () => {
    component.getAllAddresses(1, 5);
    expect(mockAddressService.listAll).toHaveBeenCalledWith(1, 5);
  })
  
});
