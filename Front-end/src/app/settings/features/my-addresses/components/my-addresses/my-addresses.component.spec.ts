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
>>>>>>>> origin/develop:Front-end/src/app/settings/features/my-addresses/components/my-addresses/my-addresses.component.spec.ts
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
