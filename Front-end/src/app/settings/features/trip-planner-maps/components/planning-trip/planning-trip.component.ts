import { Component, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { TripPlannerMapsService } from '../../../../core/services/trip-planner-maps/trip-planner-maps.service';
import { LocationService } from '../../../../core/services/location/location.service';
import { GeocodingService } from '../../../../core/services/geocoding/geocoding.service';
import { MapService } from '../../../../core/services/map/map.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalFormVehicleBatteryComponent } from '../modal-form-vehicle-battery/modal-form-vehicle-battery.component';
import { Step } from '../../../../core/models/step';

@Component({
  selector: 'app-planning-trip',
  templateUrl: './planning-trip.component.html',
  styleUrls: ['./planning-trip.component.scss']
})
export class PlanningTripComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  @ViewChild('startLocationInput', { static: false }) startLocationInput!: ElementRef;
  @ViewChild('endLocationInput', { static: false }) endLocationInput!: ElementRef;

  startLocation: google.maps.LatLng | null = null;
  endLocation: google.maps.LatLng | null = null;
  currentPlace: google.maps.places.PlaceResult | null = null;
  isRouteActive: boolean = false;
  map!: google.maps.Map;
  markers: google.maps.Marker[] = [];
  directionsService!: google.maps.DirectionsService;
  directionsRenderer!: google.maps.DirectionsRenderer;
  currentLocation: google.maps.LatLng | null = null;
  stepsArray: Step[] = [];
  totalDistance: number = 0; // Corrigido: totaldistance para totalDistance
  inputsVisible: boolean = true; // Controla a visibilidade dos inputs

  constructor(
    private tripPlannerMapsService: TripPlannerMapsService,
    private locationService: LocationService,
    private geocodingService: GeocodingService,
    private mapService: MapService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  async ngAfterViewInit() {
    await this.mapService.loadGoogleMapsScript();
    this.map = await this.mapService.initMap(this.mapContainer);
    this.useCurrentLocation();

    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer.setMap(this.map);

    this.initAutocomplete();
  }

  async useCurrentLocation() {
    this.startLocation = await this.locationService.getUserLocation();
    if (this.startLocation) {
      this.map.setCenter(this.startLocation);
    }
  }

  initAutocomplete() {
    const startInput = this.startLocationInput.nativeElement;
    const endInput = this.endLocationInput.nativeElement;

    const options = {
      componentRestrictions: { country: 'br' }
    };

    const autocompleteStart = new google.maps.places.Autocomplete(startInput, options);
    const autocompleteEnd = new google.maps.places.Autocomplete(endInput, options);

    autocompleteStart.addListener('place_changed', () => {
      const place = autocompleteStart.getPlace();
      this.startLocation = place.geometry?.location || null;
    });

    autocompleteEnd.addListener('place_changed', () => {
      const place = autocompleteEnd.getPlace();
      this.endLocation = place.geometry?.location || null;
    });
  }

  async planTrip() {
    if (!this.startLocation || !this.endLocation) {
      console.error('Por favor, selecione os locais de início e destino.');
      return;
    }
    this.map.setCenter(this.startLocation);
    this.inputsVisible = false; // Esconde os inputs
    try {
      await this.calculateRouteDistance(this.startLocation, this.endLocation);
      this.setCurrentPlace({ address: this.endLocation?.toString() || '', lat: this.endLocation?.lat() || 0, lng: this.endLocation?.lng() || 0 });
      this.openModalAddVehicleBattery();
    } catch (error) {
      console.error('Erro ao calcular a distância:', error);
    }
  }
  openModalAddVehicleBattery() {
    const chargingStationDialogRef = this.dialog.open(ModalFormVehicleBatteryComponent, {
      width: '480px',
      height: '530px',
      data: {
        stepsArray: this.stepsArray,
        place: this.startLocation,
        isStation: false
      },
    });

    chargingStationDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.handleVehicleBatteryModalClose();
      }
    });
  }

  private handleVehicleBatteryModalClose() {
    const destination = this.currentPlace?.geometry?.location;
    console.log(destination)
    this.isRouteActive = true;
    this.directionsRenderer.setOptions({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#19B6DD',
      },
    });
  
    if (destination) {
      this.initiateRoute(destination);
    } else {
      console.error('Localização do destino não disponível.');
    }
  }

  initiateRoute(destination: google.maps.LatLng) {
    if (!this.startLocation) {
      console.error('Localização do usuário não disponível.');
      return; // Retorne se a localização for nula
    }
  
    const request: google.maps.DirectionsRequest = {
      origin: this.startLocation, // Mantenha esta linha para usar a localização do usuário
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
    };
  
    this.directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsRenderer.setDirections(result);
        this.directionsRenderer.setMap(this.map); 
        this.isRouteActive = true;
        this.cdr.detectChanges()
      } else {
        console.error('Erro ao iniciar a rota:', status);
      }
    });
  }
  

  private setCurrentPlace(geocodedData: { address: string; lat: number; lng: number }) {
    this.currentPlace = {
      geometry: {
        location: new google.maps.LatLng(geocodedData.lat, geocodedData.lng),
      },
      name: geocodedData.address,
    };
  }

  calculateRouteDistance(startLocation: google.maps.LatLng, destination: google.maps.LatLng): Promise<void> {
    return new Promise((resolve, reject) => {
      this.tripPlannerMapsService.calculateRouteDistance(startLocation, destination)
        .then(({ steps, totalDistance }) => {
          this.stepsArray = steps;
          this.totalDistance = Number(totalDistance); // Corrigido: totaldistance para totalDistance
          this.cdr.detectChanges();
          resolve();
        })
        .catch(error => {
          console.error(error);
          this.cdr.detectChanges();
          reject(error);
        });
    });
  }
}
