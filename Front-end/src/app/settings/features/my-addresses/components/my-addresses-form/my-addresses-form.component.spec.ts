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

import { MyAddressesFormComponent } from './my-addresses-form.component';

describe('MyAddressesFormComponent', () => {
  let component: MyAddressesFormComponent;
  let fixture: ComponentFixture<MyAddressesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyAddressesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyAddressesFormComponent);
    >>>>>>>> origin/develop:Front-end/src/app/settings/features/my-addresses/components/my-addresses/my-addresses.component.spec.ts
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
