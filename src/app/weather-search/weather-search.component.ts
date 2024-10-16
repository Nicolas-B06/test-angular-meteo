import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-weather-search',
  template: `
  <div>
  <input [(ngModel)]="city" placeholder="Entrez une ville" />
  <button (click)="searchWeather()">Rechercher</button>
  <button (click)="getLocation()">Utiliser ma position actuelle</button>

</div>

<div *ngIf="isLoading" class="loader"></div>


<!-- Current day -->
<div *ngIf="weatherData">
  <h2>Météo pour {{ weatherData.location.name }}</h2>
  <img [src]="weatherData.current.condition.icon" alt="Icône météo">
  <p>Température actuelle : {{ weatherData.current.temp_c }} °C</p>
  <p>Condition : {{ weatherData.current.condition.text }}</p>
  <p>Vent : {{ weatherData.current.wind_kph }} km/h</p>
  <p>Humidité : {{ weatherData.current.humidity }}%</p>

<!-- 7 next days -->
  <h3>Prévisions sur {{ weatherData.forecast.forecastday.length }} jours :</h3>
  <div *ngFor="let day of weatherData.forecast.forecastday">
    <h4>{{ day.date }}</h4>
    <img [src]="day.day.condition.icon" alt="Icône météo">
    <p>Température maximale : {{ day.day.maxtemp_c }} °C</p>
    <p>Température minimale : {{ day.day.mintemp_c }} °C</p>
    <p>Condition : {{ day.day.condition.text }}</p>
  </div>
</div>v
  `,
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
  
    this.weatherService.getForecast(this.city).subscribe(
      data => {
        this.weatherData = data;
        this.isLoading = false;
      },
      error => {
        alert('Ville non trouvée ou problème avec l\'API.');
        this.isLoading = false;
      }
    );
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
        this.weatherData = data;
        this.isLoading = false;
      },
      error => {
        alert('Problème avec la récupération des données météo.');
        this.isLoading = false;
      }
    );
  }
}

