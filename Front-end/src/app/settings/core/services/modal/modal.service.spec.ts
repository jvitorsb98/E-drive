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

  it('should open a modal with default options when no options are provided', () => {
    const component = {}; // O componente que você quer abrir
    const data = { exampleData: 'test' };
  
    const result$ = service.openModal(component, data);
  
    expect(dialog.open).toHaveBeenCalledWith(component, {
      data,
      width: undefined,
      height: undefined,
      disableClose: false
    });
  
    result$.subscribe(result => {
      expect(result).toBe(true);
    });
  });

  it('should call afterClosed when modal is closed', () => {
    const component = {};
    const data = {};
  
    const result$ = service.openModal(component, data);
  
    result$.subscribe(result => {
      expect(result).toBe(true);
    });
  
    expect(mockDialogRef.afterClosed).toHaveBeenCalled();
  });

  it('should close the dialog when openModal is called again', () => {
    const component = {};
    const data = {};
  
    // Chama o método openModal pela primeira vez
    service.openModal(component, data);
  
    // Espera que o modal tenha sido aberto
    expect(dialog.open).toHaveBeenCalled();
  
    // Chama openModal novamente, o modal anterior deve ser fechado
    service.openModal(component, data);
  
    // Verifica se o close foi chamado
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
  


  it('should pass disableClose as false if not specified', () => {
    const component = {};
    const data = { exampleData: 'test' };
  
    const result$ = service.openModal(component, data);
  
    expect(dialog.open).toHaveBeenCalledWith(component, {
      data,
      width: undefined,
      height: undefined,
      disableClose: false
    });
  
    result$.subscribe(result => {
      expect(result).toBe(true);
    });
  });
  
  it('should call dialog.open with the correct component type', () => {
    const component = {}; // O componente que você quer abrir
    const data = { exampleData: 'test' };
  
    const result$ = service.openModal(component, data);
  
    // Verifica se dialog.open foi chamado com o componente correto
    expect(dialog.open).toHaveBeenCalledWith(component, expect.objectContaining({
      data,
      width: undefined,
      height: undefined,
      disableClose: false
    }));
  
    result$.subscribe(result => {
      expect(result).toBe(true);
    });
  });
  
  
});
