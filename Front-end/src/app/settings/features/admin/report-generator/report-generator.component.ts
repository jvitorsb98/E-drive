import { Component } from '@angular/core';
import { ReportService } from '../../../core/services/report/report.service';

@Component({
  selector: 'app-report-generator',
  templateUrl: './report-generator.component.html',
  styleUrl: './report-generator.component.scss'
})
export class ReportGeneratorComponent {

  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
  }

  // loadMostRegisteredCarsReport() {
  //   this.reportService.getMostRegisteredCarsReport().subscribe({
  //     next: (data) => this.downloadFile(data, 'most-registered-cars-report.pdf'),
  //     error: (err) => console.error('Erro ao gerar relatório:', err)
  //   });
  // }

  // private downloadFile(blob: Blob, fileName: string): void {
  //   const link = document.createElement('a');
  //   link.href = window.URL.createObjectURL(blob);
  //   link.download = fileName;
  //   link.click();
  //   window.URL.revokeObjectURL(link.href); // Libera o recurso após o download
  // }

  loadMostRegisteredCarsReport() {
    this.reportService.getMostRegisteredCarsReport().subscribe({
      next: (data) => this.openInNewTab(data),
      error: (err) => console.error('Erro ao gerar relatório:', err)
    });
  }

  private openInNewTab(blob: Blob): void {
    const blobUrl = window.URL.createObjectURL(blob); // Cria uma URL para o Blob
    window.open(blobUrl, '_blank'); // Abre em uma nova aba
    window.URL.revokeObjectURL(blobUrl); // Libera o recurso após o uso
  }
}
