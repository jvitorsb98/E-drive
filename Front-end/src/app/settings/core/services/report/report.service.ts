// Imports Angular necessários
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Import do ambiente para utilizar a URL da API
import { environment } from '../../../../../environments/environment';

// Importação do Observable para trabalhar com programação reativa
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // O serviço estará disponível em toda a aplicação
})
export class ReportService {
  private reportUrl: string;

  /**
   * Construtor do serviço
   * @param http - Serviço HttpClient para realizar requisições HTTP
   */
  constructor(private http: HttpClient) {
    // Define a URL base utilizando a variável de ambiente
    this.reportUrl = `${environment.apiUrl}/api/v1/reports`;
  }

  /**
 * Método para gerar um relatório genérico.
 * @param fileName Nome do arquivo Jasper (sem extensão).
 * @returns Observable<Blob> - Resposta com o arquivo em formato binário.
 */
  generateReport(fileName: string): Observable<Blob> {
    return this.http.get(`${this.reportUrl}/generate-report?reportName=${fileName}`, {
      responseType: 'blob'
    });
  }
}