import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMyAddressesComponent } from './list-my-addresses.component';

describe('ListMyAddressesComponent', () => {
  let component: ListMyAddressesComponent;
  let fixture: ComponentFixture<ListMyAddressesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListMyAddressesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListMyAddressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
