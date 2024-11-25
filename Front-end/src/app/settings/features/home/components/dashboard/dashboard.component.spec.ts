import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { UserService } from '../../../../core/services/user/user.service';
import { User } from '../../../../core/models/user';
import { Role } from '../../../../core/models/role';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockUserService: Partial<UserService>;

  beforeEach(async () => {
    mockUserService = {
      getAuthenticatedUserDetails: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
  it('should set isAdmin to true if the user has an ADMIN role', () => {
    const user: User = { 
      id: 1, 
      name: 'Admin User', 
      roles: [{ id: 1, name: 'ADMIN' }], 
      email: 'admin@example.com', 
      cellPhone: '123456789', 
      password: 'password123', 
      birth: new Date('1990-01-01'), 
      countryCode: '+1' 
    };
    jest.spyOn(mockUserService, 'getAuthenticatedUserDetails').mockReturnValue(of(user));
  
    fixture.detectChanges();
  
    expect(component.isAdmin).toBe(true);
  });
  
  it('should set isAdmin to false if the user does not have an ADMIN role', () => {
    const user: User = { 
      id: 2, 
      name: 'Regular User', 
      roles: [{ id: 2, name: 'USER' }], 
      email: 'user@example.com', 
      cellPhone: '987654321', 
      password: 'password321', 
      birth: new Date('1992-02-02'), 
      countryCode: '+1' 
    };
    jest.spyOn(mockUserService, 'getAuthenticatedUserDetails').mockReturnValue(of(user));
  
    fixture.detectChanges();
  
    expect(component.isAdmin).toBe(false);
  });
  
  it('should return correct column classes based on item index', () => {
    component.menuLinks = [
      { route: '/link1', icon: 'icon1', label: 'Link 1' },
      { route: '/link2', icon: 'icon2', label: 'Link 2' },
      { route: '/link3', icon: 'icon3', label: 'Link 3' },
      { route: '/link4', icon: 'icon4', label: 'Link 4' },
      { route: '/link5', icon: 'icon5', label: 'Link 5' },
    ];
  
    // Para uma linha cheia com três itens (0, 1, 2), espera-se 'col-4'
    expect(component.getColumnClass(0)).toBe('col-4');
    expect(component.getColumnClass(1)).toBe('col-4');
    expect(component.getColumnClass(2)).toBe('col-4');
  
    // Para a última linha com dois itens (índices 3 e 4), espera-se 'col-6'
    expect(component.getColumnClass(3)).toBe('col-6');
    expect(component.getColumnClass(4)).toBe('col-6'); // Mudança para refletir corretamente a lógica
  });
  
  
  
});