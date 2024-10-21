import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }


  getUserLocation(): Promise<google.maps.LatLng | null> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            resolve(userLocation); 
          },
          error => {
            console.error('Erro ao obter localização do usuário:', error);
            reject(error);
          }
        );
      } else {
        console.error('Geolocalização não suportada');
        reject(null); 
      }
    });
  }
}
