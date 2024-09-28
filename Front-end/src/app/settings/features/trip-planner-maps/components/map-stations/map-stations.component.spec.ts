import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapStationsComponent } from './map-stations.component';

describe('MapStationsComponent', () => {
  let component: MapStationsComponent;
  let fixture: ComponentFixture<MapStationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapStationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MapStationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
