import { TestBed } from '@angular/core/testing';
import Swal from 'sweetalert2';
import { AlertasService } from './alertas.service';

// Mock do SweetAlert2
jest.mock('sweetalert2', () => ({
  fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
}));

describe('AlertasService', () => {
  let service: AlertasService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlertasService],
    });
    service = TestBed.inject(AlertasService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpa os mocks após cada teste
  });

  describe('showSwal', () => {
    it('deve chamar Swal.fire com os parâmetros corretos e retornar isConfirmed', async () => {
      const result = await service.showSwal('success', 'Título', 'Texto', 'Confirmar');

      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'success',
        title: 'Título',
        text: 'Texto',
        confirmButtonText: 'Confirmar',
        customClass: undefined,
      });
      expect(result).toBe(true);
    });
  });

  describe('showSuccess', () => {
    it('deve exibir um alerta de sucesso com classes customizadas padrão', async () => {
      const result = await service.showSuccess('Título', 'Texto');

      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'success',
        title: 'Título',
        text: 'Texto',
        confirmButtonText: 'Ok',
        customClass: {
          popup: 'custom-swal-popup-success',
          confirmButton: 'custom-swal-confirm-button-success',
        },
      });
      expect(result).toBe(true);
    });
  });

  describe('showError', () => {
    it('deve exibir um alerta de erro com classes customizadas padrão', async () => {
      const result = await service.showError('Título', 'Texto');

      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'Título',
        text: 'Texto',
        confirmButtonText: 'Ok',
        customClass: {
          popup: 'custom-swal-popup-error',
          confirmButton: 'custom-swal-confirm-button-error',
        },
      });
      expect(result).toBe(true);
    });
  });

  describe('showTableAlert', () => {
    it('deve exibir um alerta com tabela', async () => {
      const headers = ['Coluna 1', 'Coluna 2'];
      const rows = [['Valor 1', 'Valor 2'], ['Valor 3', 'Valor 4']];
      const tableHtml = service['generateTableHtml'](headers, rows);

      const result = await service.showTableAlert('Título da Tabela', headers, rows);

      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'info',
        title: 'Título da Tabela',
        html: tableHtml,
        confirmButtonText: 'Ok',
        customClass: undefined,
      });
      expect(result).toBe(true);
    });
  });

  describe('generateTableHtml', () => {
    it('deve gerar o HTML correto para a tabela', () => {
      const headers = ['Nome', 'Idade'];
      const rows = [['João', '30'], ['Maria', '25']];

      const expectedHtml = `
      <div style="overflow-x:auto; max-width: 100%;">
        <table style="font-size: 8px; width: 100%; border-collapse: collapse;">
          <thead style="font-weight: bold;">
            <tr>
<th style="border: 1px solid #ddd; padding: 3px; background-color: #f2f2f2; font-size: 10px;">Nome</th><th style="border: 1px solid #ddd; padding: 3px; background-color: #f2f2f2; font-size: 10px;">Idade</th>
</tr>
          </thead>
          <tbody>
<tr><td style="border: 1px solid #ddd; padding: 3px; text-align: left; font-size: 10px;">João</td><td style="border: 1px solid #ddd; padding: 3px; text-align: left; font-size: 10px;">30</td></tr><tr><td style="border: 1px solid #ddd; padding: 3px; text-align: left; font-size: 10px;">Maria</td><td style="border: 1px solid #ddd; padding: 3px; text-align: left; font-size: 10px;">25</td></tr>
</tbody>
        </table>
      </div>
    `.replace(/\s+/g, ''); // Remove espaços extras para comparação

      const generatedHtml = service['generateTableHtml'](headers, rows).replace(/\s+/g, '');

      expect(generatedHtml).toBe(expectedHtml);
    });
  });
});
