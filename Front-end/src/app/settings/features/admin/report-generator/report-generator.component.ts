import { Component } from '@angular/core';
import { ReportService } from '../../../core/services/report/report.service';

@Component({
  selector: 'app-report-generator',
  templateUrl: './report-generator.component.html',
  styleUrl: './report-generator.component.scss'
})
export class ReportGeneratorComponent {

  /**
 * Construtor da classe `ReportGeneratorComponent`
 * Injeta a dependência do serviço `ReportService` para permitir chamadas ao backend.
 * @param reportService - Serviço responsável por gerar relatórios.
 */
  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
  }

  /**
 * Método para carregar o relatório de carros mais registrados
 * Chama o serviço que obtém o relatório e inicia o download do arquivo gerado.
 */
  // loadMostRegisteredCarsReport() {
  //   // Faz a requisição ao serviço para obter o relatório em formato de arquivo binário (Blob)
  //   this.reportService.getMostRegisteredCarsReport().subscribe({
  //     // Caso a requisição seja bem-sucedida, chama o método para baixar o arquivo
  //     next: (data) => this.downloadFile(data, 'most-registered-cars-report.pdf'),
  //     // Em caso de erro, exibe a mensagem no console
  //     error: (err) => console.error('Erro ao gerar relatório:', err)
  //   });
  // }

  /**
   * Método para baixar um arquivo no navegador
   * @param blob - O arquivo binário (Blob) retornado pela requisição
   * @param fileName - O nome do arquivo para salvar no download
   */
  // private downloadFile(blob: Blob, fileName: string): void {
  //   // Cria um elemento <a> dinamicamente para simular o clique em um link de download
  //   const link = document.createElement('a');

  //   // Gera uma URL temporária para o Blob
  //   link.href = window.URL.createObjectURL(blob);

  //   // Define o nome do arquivo para o download
  //   link.download = fileName;

  //   // Simula o clique no link para iniciar o download
  //   link.click();

  //   // Libera a URL temporária criada para evitar consumo de memória
  //   window.URL.revokeObjectURL(link.href);
  // }

  /**
 * Método para carregar o relatório de carros mais registrados
 * Chama o serviço que obtém o relatório e abre o PDF em uma nova aba do navegador.
 */
  loadMostRegisteredCarsReport() {
    // Faz a requisição para obter o relatório do serviço
    this.reportService.getMostRegisteredCarsReport().subscribe({
      // Caso a requisição seja bem-sucedida, abre o relatório em uma nova aba
      next: (data) => this.openInNewTab(data),
      // Caso ocorra um erro, exibe a mensagem no console
      error: (err) => console.error('Erro ao gerar relatório:', err)
    });
  }

  /**
   * Método para abrir o arquivo em uma nova aba do navegador
   * @param blob - O arquivo binário (PDF) retornado pela requisição
   */
  private openInNewTab(blob: Blob): void {
    // Cria uma URL temporária para o Blob
    const blobUrl = window.URL.createObjectURL(blob);

    // Abre a URL gerada em uma nova aba do navegador
    window.open(blobUrl, '_blank');

    // Libera a memória usada pela URL temporária
    window.URL.revokeObjectURL(blobUrl);
  }

}
