import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAddressesComponent } from './my-addresses.component';

describe('MyAddressesComponent', () => {
  let component: MyAddressesComponent;
  let fixture: ComponentFixture<MyAddressesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyAddressesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyAddressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
