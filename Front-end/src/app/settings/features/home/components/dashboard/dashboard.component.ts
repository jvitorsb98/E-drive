import { Component, OnInit } from '@angular/core';
import { Role } from '../../../../core/models/role';
import { UserService } from '../../../../core/services/user/user.service';
import { User } from '../../../../core/models/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  isAdmin: boolean = false; // Adicionando esta propriedade

  menuLinks = [
    { route: '/e-driver/users/my-addresses', icon: 'home', label: 'Meus Endereços' },
    { route: '/e-driver/users/my-vehicles', icon: 'directions_car', label: 'Meus Veículos' },
    { route: '/e-driver/map/plan-trip', icon: 'map', label: 'Planejar Viagem' }, // Rota para Planejar Viagem
  ];

  adminLinks = [
    { route: '/e-driver/admin/vehicles', icon: 'directions_car', label: 'Veículos' },
    { route: '/e-driver/admin/brands', icon: 'emoji_flags', label: 'Marcas' },
    { route: '/e-driver/admin/models', icon: 'view_carousel', label: 'Modelos' },
    { route: '/e-driver/admin/reports', icon: 'analytics', label: 'Reports' },



    // <mat-icon > analytics </mat-icon>
    // < mat - icon > assessment </mat-icon>
    // < mat - icon > bar_chart </mat-icon>
    // < mat - icon > pie_chart </mat-icon>
    // < mat - icon > insert_chart </mat-icon>
    // < mat - icon > table_chart </mat-icon>
    // < mat - icon > list_alt </mat-icon>
    // < mat - icon > description </mat-icon>
    // < mat - icon > dashboard </mat-icon>
    // < mat - icon > data_usage </mat-icon>

  ];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getAuthenticatedUserDetails().subscribe(user => {
      this.user = user;
      this.isAdmin = user.roles.some(role => role.name === 'ADMIN');
    });
  }


  getColumnClass(index: number): string {
    const totalItems = this.menuLinks.length;
    const itemsPerRow = 4;
    const remainingItems = totalItems % itemsPerRow;
    const isLastRow = index >= totalItems - remainingItems;

    if (isLastRow && remainingItems === 1) {
      return 'col-12';
    } else if (isLastRow && remainingItems === 2) {
      return 'col-6';
    }
    return 'col-4';
  }
}
