import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { GeocodingResponse } from '../../../models/geocoding-response';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {

  private geocodeUrl: string;

  constructor(private http: HttpClient) {
    this.geocodeUrl = '/api/maps/api/geocode/json';
  }


  geocode(address: string): Observable<GeocodingResponse> {
    const apiKey = environment.googleMapsApiKey; 
    const url = `${this.geocodeUrl}?address=${encodeURIComponent(address)}&key=${apiKey}`;
    console.log(url)
    return this.http.get<GeocodingResponse>(url);
}


}