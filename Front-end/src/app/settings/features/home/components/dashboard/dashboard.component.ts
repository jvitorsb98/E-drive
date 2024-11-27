import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../core/services/user/user.service';
import { User } from '../../../../core/models/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  /**
 * @description Lista consolidada de links a serem exibidos no menu, combinando links de usuário e de administrador.
 */
  allLinks: { route: string, icon: string, label: string }[] = [];

  /**
   * @description Objeto representando o usuário autenticado. Nulo caso nenhum usuário esteja logado.
   */
  user: User | null = null;

  /**
   * @description Indica se o usuário autenticado possui a permissão de administrador.
   */
  isAdmin: boolean = false; 

  /**
   * @description Links padrão disponíveis para todos os usuários.
   */
  menuLinks = [
    { route: '/e-driver/users/my-addresses', icon: 'home', label: 'Meus Endereços' },
    { route: '/e-driver/users/my-vehicles', icon: 'directions_car', label: 'Meus Veículos' },
    { route: '/e-driver/map/plan-trip', icon: 'map', label: 'Planejar Viagem' }, // Rota para Planejar Viagem
  ];

  /**
   * @description Links exclusivos para administradores.
   */
  adminLinks = [
    { route: '/e-driver/admin/vehicles', icon: 'directions_car', label: 'Veículos' },
    { route: '/e-driver/admin/brands', icon: 'emoji_flags', label: 'Marcas' },
    { route: '/e-driver/admin/models', icon: 'view_carousel', label: 'Modelos' },
    { route: '/e-driver/admin/reports', icon: 'description', label: 'Relatórios' },
  ];

  /**
   * @description Construtor do componente que injeta o serviço do usuário autenticado.
   * @param userService Serviço para recuperar detalhes do usuário autenticado.
   */
  constructor(private userService: UserService) { }

  /**
   * @description Inicializa o componente, recuperando os detalhes do usuário autenticado
   *              e determinando se ele possui permissão de administrador.
   */
  ngOnInit(): void {
    this.userService.getAuthenticatedUserDetails().subscribe(user => {
      this.user = user;
      this.isAdmin = user.roles.some(role => role.name === 'ADMIN');
      this.allLinks = [...this.menuLinks, ...(this.isAdmin ? this.adminLinks : [])];
    });
  }

  /**
   * @description Retorna a classe CSS apropriada para um item do menu baseado no índice e
   *              na quantidade total de itens. Garante o layout adequado para a última linha.
   * @param index Índice do item no array de links.
   * @returns Classe CSS correspondente ao layout do item.
   */
  getColumnClass(index: number): string {
    const totalItems = this.menuLinks.length + (this.isAdmin ? this.adminLinks.length : 0);
    const itemsPerRow = 4; // Quantidade de itens por linha
    const remainingItems = totalItems % itemsPerRow;
    const isLastRow = index >= totalItems - remainingItems;

    if (isLastRow && remainingItems === 1) {
      return 'col-12'; // Item ocupa a largura total
    } else if (isLastRow && remainingItems === 2) {
      return 'col-6'; // Dois itens dividem a linha igualmente
    }
    return 'col-4'; // Itens normais ocupam 1/4 da linha
  }

}
