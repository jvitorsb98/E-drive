import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ReportService } from '../../../core/services/report/report.service';
import { AlertasService } from '../../../core/services/Alertas/alertas.service';

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
    { id: 1, name: 'Relatório de Carros Mais Registrados', fileName: 'most_registered_cars' },
    { id: 2, name: 'Relatório de Autonomia de Veículos', fileName: 'vehicle_autonomy' },
    { id: 3, name: 'Relatório de Endereços Mais Registrados', fileName: 'address_count_bycity' },
    { id: 4, name: 'Relatório de Logs de Auditoria' },
    { id: 5, name: 'Relatório de Autonomia de Veículos' },
    { id: 6, name: 'Relatório de Veículos por Categoria' },
    { id: 7, name: 'Relatório de Usuários Mais Ativos' },
    { id: 8, name: 'Relatório de Viagens Realizadas' },
    { id: 9, name: 'Relatório de Viagens por Carro' },
    { id: 10, name: 'Relatório de Viagens por Usuário' },

  ];
  filteredReports: Observable<{ id: number; name: string }[]> = of([]); // Lista de relatórios filtrada para o autocomplete

  /**
   * @description Construtor da classe `ReportGeneratorComponent`
   * Injeta as dependências necessárias para o funcionamento do componente.
   * @param reportService Serviço responsável por gerar relatórios.
   * @param formBuilder FormBuilder para criar formulários reativos.
   * @param alertService Serviço de alertas.
   * @param router Router para navegação entre páginas.
   */
  constructor(
    private reportService: ReportService,
    private formBuilder: FormBuilder,
    private alertService: AlertasService,
    private router: Router
  ) { }

  /**
   *@description Método de ciclo de vida do Angular chamado ao inicializar o componente.
   */
  ngOnInit(): void {
    this.buildForm();
    this.setupAutocomplete();
  }

  /**
   * @description Inicializa o formulário para seleção de relatórios.
   */
  private buildForm() {
    this.reportForm = this.formBuilder.group({
      report: new FormControl(null, [Validators.required])
    });
  }

  /**
   * @description Configura o comportamento de autocomplete do campo de relatório.
   */
  setupAutocomplete() {
    this.filteredReports = this.reportForm.get('report')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
        const filtered = this.reports.filter(report => report.name.toLowerCase().includes(filterValue));

        this.checkNoReportFound(value, filtered);
        return filtered;
      })
    );
  }

  /**
   * @description Exibe o nome do relatório selecionado no campo do autocomplete.
   * @param report Objeto do relatório selecionado.
   * @returns Nome do relatório ou uma string vazia.
   */
  displayReportName(report: { id: number; name: string } | null): string {
    return report ? report.name : '';
  }

  /**
   * @description Método chamado ao submeter o formulário de relatórios.
   */
  gerarReport(): void {
    const selectedReport = this.reportForm.get('report')?.value;

    if (!selectedReport || !selectedReport.fileName) {
      this.alertService.showWarning('Relatório não encontrado', 'O relatório selecionado não foi encontrado.');
      return;
    }
    this.loadReport(selectedReport.fileName);
  }

  /**
 * Método genérico para carregar relatórios.
 * @param fileName Nome do arquivo Jasper (sem extensão).
 */
  loadReport(fileName: string): void {
    this.reportService.generateReport(fileName).subscribe({
      next: (data) => this.openInNewTab(data),
      error: (err) => console.error('Erro ao gerar relatório:', err)
    });
  }

  /**
   * @description Abre o relatório em uma nova aba do navegador.
   * @param blob O arquivo binário (PDF) retornado pela requisição.
   */
  private openInNewTab(blob: Blob): void {
    const blobUrl = window.URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
    window.URL.revokeObjectURL(blobUrl);
  }

  /**
   * @description Alterna a visibilidade do painel de autocomplete.
   * @param event Evento disparado pelo clique do botão.
   */
  toggleAutocomplete(event: Event) {
    event.stopPropagation();
    if (!this.autocompleteTrigger.panelOpen) {
      this.autocompleteTrigger.openPanel();
    } else {
      this.autocompleteTrigger.closePanel();
    }
  }

  /**
   * @description Verifica se nenhum relatório foi encontrado com base no valor filtrado.
   * @param value Valor do campo de autocomplete.
   * @param filtered Lista filtrada de relatórios.
   */
  checkNoReportFound(value: string | { id: number; name: string }, filtered: any[]) {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      this.noReportFound = true;
    } else if (typeof value === 'string') {
      this.noReportFound = filtered.length === 0;
    } else {
      this.noReportFound = !this.reports.some(report => report.id === (value as { id: number }).id);
    }
  }

  /**
   * @description Navega de volta para a dashboard do E-Driver.
   */
  goBack(): void {
    this.router.navigate(['/e-driver/dashboard']);
  }
}
