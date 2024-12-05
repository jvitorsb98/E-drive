import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanningTripComponent } from './planning-trip.component';
import { TripPlannerMapsService } from '../../../../core/services/trip-planner-maps/trip-planner-maps.service';
import { MapService } from '../../../../core/services/map/map.service';
import { RouteService } from '../../../../core/services/trip-planner-maps/route/route.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { ElementRef } from '@angular/core';

// Mockando google.maps
global['google'] = {
  maps: {
    LatLng: jest.fn().mockImplementation((lat: number, lng: number) => {
      return { lat: () => lat, lng: () => lng }; // Mock de LatLng
    }),
    Map: jest.fn().mockImplementation(() => ({
      setCenter: jest.fn(),
      setZoom: jest.fn(),
      setMapTypeId: jest.fn(),
      setOptions: jest.fn(),
      DEMO_MAP_ID: 'mockMapId',
    })),
    DirectionsService: jest.fn(),
    DirectionsRenderer: jest.fn(),
    MapTypeId: { ROADMAP: 'ROADMAP' },
  }
} as any;

jest.mock('../../../../core/services/trip-planner-maps/trip-planner-maps.service');
jest.mock('../../../../core/services/map/map.service');
jest.mock('../../../../core/services/trip-planner-maps/route/route.service');
jest.mock('@angular/material/dialog');

describe('PlanningTripComponent', () => {
  let component: PlanningTripComponent;
  let fixture: ComponentFixture<PlanningTripComponent>;
  let tripPlannerMapsService: TripPlannerMapsService;
  let mapService: MapService;
  let routeService: RouteService;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanningTripComponent ],
      providers: [
        ChangeDetectorRef,
        { provide: TripPlannerMapsService, useClass: TripPlannerMapsService },
        { provide: MapService, useClass: MapService },
        { provide: RouteService, useClass: RouteService },
        { provide: MatDialog, useClass: MatDialog },
        { provide: ElementRef, useValue: { nativeElement: {} } } // Mockando o ElementRef
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningTripComponent);
    component = fixture.componentInstance;

    tripPlannerMapsService = TestBed.inject(TripPlannerMapsService);
    mapService = TestBed.inject(MapService);
    routeService = TestBed.inject(RouteService);
    dialog = TestBed.inject(MatDialog);
  });


  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });




});
