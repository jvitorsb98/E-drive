import { ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<<< HEAD:Front-end/src/app/settings/features/brand/components/brand-view/brand-view.component.spec.ts
import { BrandViewComponent } from './brand-view.component';

describe('BrandViewComponent', () => {
  let component: BrandViewComponent;
  let fixture: ComponentFixture<BrandViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrandViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandViewComponent);
========

import { ModalFormMyAddressesComponent } from './modal-form-my-addresses.component';

describe('ModalFormMyAddressesComponent', () => {
  let component: ModalFormMyAddressesComponent;
  let fixture: ComponentFixture<ModalFormMyAddressesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalFormMyAddressesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFormMyAddressesComponent);
    >>>>>>>> origin/develop:Front-end/src/app/settings/features/my-addresses/components/my-addresses/my-addresses.component.spec.ts
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
