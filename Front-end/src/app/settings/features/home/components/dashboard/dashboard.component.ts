// Imports do Angular
import { Component } from '@angular/core';

// Componente para o Dashboard
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'] // Corrigido para 'styleUrls'
})
export class DashboardComponent {

  constructor() { }

  // Links do menu para navegação
  menuLinks = [
    { route: '/e-driver/users/my-addresses', icon: 'home', label: 'Meus Endereços' },
    { route: '/e-driver/users/my-vehicles', icon: 'directions_car', label: 'Meus Carros' },
    { route: '/e-driver/users/plan-trip', icon: 'map', label: 'Planejar Viagem' }
  ];

  // Calcula a classe da coluna com base no índice do item
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
