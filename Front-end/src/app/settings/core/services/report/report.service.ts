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
   * Método para obter o relatório de carros mais registrados
   * Faz uma requisição HTTP GET e retorna um Blob contendo o arquivo do relatório
   * @returns Observable<Blob> - Resposta com o arquivo em formato binário
   */
  getMostRegisteredCarsReport(): Observable<Blob> {
    return this.http.get(`${this.reportUrl}/most-registered-cars`, {
      responseType: 'blob' // Indica que a resposta será do tipo binário
    });
  }

  /**
 * Método para obter o relatório de carros com a maior autonomia elétrica
 * Faz uma requisição HTTP GET e retorna um Blob contendo o arquivo do relatório
 * @returns Observable<Blob> - Resposta com o arquivo em formato binário
 */
  getHighestElectricAutonomyCarsReport(): Observable<Blob> {
    return this.http.get(`${this.reportUrl}/highest-electric-autonomy-cars`, {
      responseType: 'blob' // Indica que a resposta será do tipo binário
    });
  }


}

