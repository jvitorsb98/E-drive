import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor() { }


  menuLinks = [
    { route: '/e-driver/users/my-addresses', icon: 'home', label: 'Meus Endereços' },
    { route: '/e-driver/users/my-vehicles', icon: 'directions_car', label: 'Meus Carros' },
    { route: '/e-driver/users/plan-trip', icon: 'map', label: 'Planejar Viagem' }
  ];

  getColumnClass(index: number): string {
    const totalItems = this.menuLinks.length;
    const itemsPerRow = 3;
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
