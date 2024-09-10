import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor() { }

  menuLinks = [
    { route: '/meus-enderecos', icon: 'home', label: 'Meus Endereços' },
    { route: '/meus-carros', icon: 'directions_car', label: 'Meus Carros' },
    { route: '/planejar-viagem', icon: 'map', label: 'Planejar Viagem' }
  ];


}
