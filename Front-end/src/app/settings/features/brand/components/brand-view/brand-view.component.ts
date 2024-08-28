import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Brand } from '../../../../core/models/brand';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BrandService } from '../../../../core/services/brand/brand.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-brand-view',
  templateUrl: './brand-view.component.html',
  styleUrl: './brand-view.component.scss'
})
export class BrandViewComponent {
  displayedColumns: string[] = ['icon', 'name', 'actions'];
  dataSource = new MatTableDataSource<Brand>();
  brandList: Brand[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private brandService: BrandService, private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource(this.brandList);
  }

  ngOnInit() {
    this.getListBrands();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
  }

  getListBrands() {
    this.brandService.getAllBrands().subscribe({
      next: (response: Brand[]) => {
        console.log('Response from getAllBrands:', response);

        if (response && Array.isArray(response)) {
          this.brandList = response;
          this.dataSource = new MatTableDataSource(this.brandList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      error: (error) => {
        console.error('Error on getListBrands:', error);
      }
    });
  }
}
