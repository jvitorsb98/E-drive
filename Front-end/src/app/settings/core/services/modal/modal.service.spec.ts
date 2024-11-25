import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ModalService } from './modal.service';

describe('ModalService', () => {
  let service: ModalService;
  let dialog: MatDialog;

  const mockDialogRef = {
    afterClosed: jest.fn().mockReturnValue(of(true)),
    close: jest.fn()
  } as unknown as MatDialogRef<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ModalService,
        {
          provide: MatDialog,
          useValue: {
            open: jest.fn().mockReturnValue(mockDialogRef)
          }
        }
      ]
    });

    service = TestBed.inject(ModalService);
    dialog = TestBed.inject(MatDialog);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open a modal with the provided component and options', () => {
    const component = {}; // O componente que você quer abrir
    const data = { exampleData: 'test' };
    const options = { width: '500px', height: '500px', disableClose: true };

    const result$ = service.openModal(component, data, options);

    expect(dialog.open).toHaveBeenCalledWith(component, {
      data,
      width: '500px',
      height: '500px',
      disableClose: true
    });

    result$.subscribe(result => {
      expect(result).toBe(true);
    });
  });

  it('should close the previous dialog if one is already open', () => {
    const component = {};
    const data = {};

    // Abre o primeiro modal
    service.openModal(component, data);
    expect(mockDialogRef.close).not.toHaveBeenCalled();

    // Abre o segundo modal, o primeiro deve fechar
    service.openModal(component, data);
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});