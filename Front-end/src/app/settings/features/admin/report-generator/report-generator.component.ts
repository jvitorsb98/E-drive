import { Component, ViewChild } from '@angular/core';
import { ReportService } from '../../../core/services/report/report.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, Observable, of, startWith } from 'rxjs';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-generator',
  templateUrl: './report-generator.component.html',
  styleUrl: './report-generator.component.scss'
})
export class ReportGeneratorComponent {
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;
  reportForm!: FormGroup; // Formulário para seleção de relatórios
  noReportFound: boolean = false; // Indica se nenhum relatório foi encontrado
  reports = [ // Lista mockada de relatórios
    { id: 1, name: 'Relatório de Carros Mais Registrados' },
    { id: 2, name: 'Relatório de Endereços de Usuários' },
    { id: 3, name: 'Relatório de Logs de Auditoria' },
    { id: 4, name: 'Relatório de Autonomia de Veículos' },
    { id: 5, name: 'Relatório de Veículos por Categoria' },
    { id: 5, name: 'Relatório de Usuários Mais Ativos' },
    { id: 6, name: 'Relatório de Viagens Realizadas' },
    { id: 7, name: 'Relatório de Viagens por Carro' },
  ];
  filteredReports: Observable<{ id: number; name: string }[]> = of([]); // Lista de relatórios filtrada para o autocomplete

  /**
   * Construtor da classe `ReportGeneratorComponent`
   * Injeta a dependência do serviço `ReportService` e do `FormBuilder` para criar formulários.
   * @param reportService - Serviço responsável por gerar relatórios.
   * @param formBuilder - FormBuilder para criar formulários reativos.
   * @param router - Router para navegação entre páginas.
   */
  constructor(
    private reportService: ReportService,
    private formBuilder: FormBuilder,
    private router: Router,) { }

  ngOnInit(): void {
    this.buildForm();
    this.setupAutocomplete();
  }

  /**
   * Inicializa o formulário para seleção de relatórios.
   */
  private buildForm() {
    this.reportForm = this.formBuilder.group({
      report: new FormControl(null, [Validators.required])
    });
  }

  setupAutocomplete() {
    this.filteredReports = this.reportForm.get('report')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
        const filtered = this.reports.filter(report => report.name.toLowerCase().includes(filterValue));
        this.noReportFound = filtered.length === 0; // Verifica se há relatórios filtrados
        return filtered;
      })
    );
  }

  /**
 * Função para exibir o nome do relatório no campo do autocomplete.
 * @param report Objeto do relatório selecionado.
 * @returns Nome do relatório ou uma string vazia.
 */
  displayReportName(report: { id: number; name: string } | null): string {
    return report ? report.name : '';
  }

  /**
   * Método chamado ao submeter o formulário de relatórios.
   * @param reportId - ID do relatório selecionado.
   */
  gerarReport(): void {
    const selectedReport = this.reportForm.get('report')?.value; // Obter o relatório selecionado
    switch (selectedReport.id) {
      case 1:
        this.loadMostRegisteredCarsReport();
        break;
      case 2:

        break;
      case 3:

        break;
      default:
        console.error('Relatório não implementado:', this.reportForm.get("report"));
    }
  }

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

  /**
   * @description Alternar a visibilidade do autocomplete.
   * @param event Evento disparado pelo clique do botão.
   */
  toggleAutocomplete(event: Event) {
    event.stopPropagation(); // Previne a propagação do evento, para evitar o fechamento inesperado

    // Abra o painel sempre, independentemente dos resultados
    if (!this.autocompleteTrigger.panelOpen) {
      this.autocompleteTrigger.openPanel();  // Abre o painel
    } else {
      this.autocompleteTrigger.closePanel();  // Se já estiver aberto, fecha
    }
  }

  goBack(): void {
    this.router.navigate(["/e-driver/dashboard"]);
  }

}
