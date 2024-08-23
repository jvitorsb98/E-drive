import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatList, MatListItem, MatNavList } from '@angular/material/list';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';

// Mask para aplicar a configuração de máscara de input de texto.
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@NgModule({
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    MatList,
    MatListItem,
    MatNavList,
    MatMenu,
    MatMenuModule,
    NgxMaskDirective,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule,
  ],
  exports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    MatList,
    MatListItem,
    MatNavList,
    MatMenu,
    MatMenuModule,
    MatPaginatorModule,
    NgxMaskDirective,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    provideNgxMask(),
    provideNativeDateAdapter()
  ],
})
export class AngularMaterialModule { }