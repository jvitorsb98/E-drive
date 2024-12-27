import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportGeneratorComponent } from './report-generator.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ReportService } from '../../../core/services/report/report.service';
import { AlertasService } from '../../../core/services/Alertas/alertas.service';
import { Router } from '@angular/router';

describe('ReportGeneratorComponent', () => {
  let component: ReportGeneratorComponent;
  let fixture: ComponentFixture<ReportGeneratorComponent>;
  let reportServiceMock: jest.Mocked<ReportService>;
  let alertServiceMock: jest.Mocked<AlertasService>;

  beforeEach(async () => {
    reportServiceMock = {
      getMostRegisteredCarsReport: jest.fn(),
      generateReport: jest.fn() // Adicione isso para simular o método
    } as unknown as jest.Mocked<ReportService>;

    alertServiceMock = {
      showWarning: jest.fn()
    } as unknown as jest.Mocked<AlertasService>;

    await TestBed.configureTestingModule({
      declarations: [ ReportGeneratorComponent ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatAutocompleteModule,
        MatDialogModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ReportService, useValue: reportServiceMock },
        { provide: AlertasService, useValue: alertServiceMock }
      ]
    }).compileComponents();
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(ReportGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the report form correctly', () => {
    expect(component.reportForm).toBeDefined();
    expect(component.reportForm.controls['report']).toBeDefined();
  });

  it('should filter reports correctly based on input', () => {
    component.reportForm.controls['report'].setValue('Carros');
    component.filteredReports.subscribe(filtered => {
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered[0].name).toContain('Carros');
    });
  });

  it('should call loadMostRegisteredCarsReport when generating the report', () => {
    const mockReport = { id: 1, name: 'Relatório de Carros Mais Registrados' };
    component.reportForm.controls['report'].setValue(mockReport);

    reportServiceMock.generateReport.mockReturnValue(of(new Blob())); // Certifique-se de que o método seja simulado

    component.gerarReport();

    expect(reportServiceMock.generateReport).toHaveBeenCalled(); // Verifique a chamada do método correto
  });


  it('should show a warning alert when report is not found', () => {
    const mockReport = { id: 999, name: 'Relatório Inexistente' };
    component.reportForm.controls['report'].setValue(mockReport);

    component.gerarReport();

    expect(alertServiceMock.showWarning).toHaveBeenCalledWith('Relatório não encontrado', 'O relatório selecionado não foi encontrado.');
  });

  it('should navigate back to dashboard when goBack is called', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.goBack();
    expect(navigateSpy).toHaveBeenCalledWith(['/e-driver/dashboard']);
  });
});
