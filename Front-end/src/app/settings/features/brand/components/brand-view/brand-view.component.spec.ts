import { ComponentFixture, TestBed } from '@angular/core/testing';

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
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
