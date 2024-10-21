export interface GeocodingResponse {
  results: Array<{
      geometry: {
          location: {
              lat: number;
              lng: number;
          };
      };
      formatted_address: string;
      place_id: string; 
  }>;
  status: string; 
  error_message?: string;
}
