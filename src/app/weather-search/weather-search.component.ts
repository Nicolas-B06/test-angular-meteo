import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-weather-search',
  templateUrl: './weather-search.component.html',
  styleUrls: ['./weather-search.component.css']
})
export class WeatherSearchComponent {
  @Input() city: string = '';
  @Output() cityChange = new EventEmitter<string>();
  weatherData: any;
  isLoading: boolean = false;  
  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    const savedCity = localStorage.getItem('lastCity');
    if (savedCity) {
      this.city = savedCity;
      this.searchWeather(); 
    }
  }
  

  searchWeather() {
    if (!this.city) {
      alert('Veuillez entrer une ville');
      return;
    }
  
    localStorage.setItem('lastCity', this.city);
  
    this.isLoading = true;
  
    this.weatherService.getForecast(this.city).subscribe({
      next: data => {
        this.weatherData = data.data;
        this.isLoading = false;
      },
      error: error => {
        alert('Ville non trouvée ou problème avec l\'API.');
        this.isLoading = false;
      }
    });
  }
  

  getLocation() {
    this.isLoading = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          this.getWeatherByCoordinates(latitude, longitude);
        },
        (error) => {
          alert('Impossible de récupérer votre position.');
          this.isLoading = false;
        }
      );
    } else {
      alert('La géolocalisation n\'est pas supportée par ce navigateur.');
      this.isLoading = false;
    }
  }

  getWeatherByCoordinates(lat: number, lon: number) {
    this.weatherService.getWeatherByCoordinates(lat, lon).subscribe(
      data => {
        this.weatherData = data.data;
        this.isLoading = false;
      },
      error => {
        alert('Problème avec la récupération des données météo.');
        this.isLoading = false;
      }
    );
  }
  
}

