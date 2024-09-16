import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarIntroComponent } from './navbar-intro.component';

describe('NavbarIntroComponent', () => {
  let component: NavbarIntroComponent;
  let fixture: ComponentFixture<NavbarIntroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarIntroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
