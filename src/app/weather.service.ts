import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = environment.API_KEY ?  environment.API_KEY : 'Api key not found';

  constructor(private http: HttpClient) { }

  getForecast(city: string, days: number = 7): Observable<any> {
    const forecastUrl = `http://api.weatherapi.com/v1/forecast.json?key=${this.apiKey}&q=${city}&days=${days}`;
    return this.http.get(forecastUrl);
  }
  
  getWeatherByCoordinates(lat: number, lon: number, days: number = 7): Observable<any> {
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${this.apiKey}&q=${lat},${lon}&days=${days}`;
    return this.http.get(url);
  }
  
  
  
}
