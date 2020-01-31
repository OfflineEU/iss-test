import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IssInfo} from './services/iss-info.service';
import {interval, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {Astronauts, CurrentLocation} from '../environments/interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  @ViewChild('mapContainer', {static: false}) mapRef: ElementRef;

  location: CurrentLocation = {latitude: '0', longitude: '0'};
  ISSTime: Date;
  astronauts: Astronauts = {people: [], number: 0};
  streamLocation$: Subscription;
  dataReady = false;

  constructor(private ISSInfoService: IssInfo) {
  }

  ngOnInit() {
    this.getCurrentPosition();
    this.streamLocation$ = interval(5000)
      .pipe(
        map(() => {
          this.getCurrentPosition();
          this.getAstronauts();
          this.getCurrentTimestamp();
          setTimeout(() =>
            this.initMap(+this.location.latitude, +this.location.longitude), 0);
        })
      ).subscribe(() => {
        this.dataReady = true;
      });
  }

  ngOnDestroy() {
    this.streamLocation$.unsubscribe();
    this.dataReady = false;
  }

  getCurrentPosition() {
    this.ISSInfoService.getLocationData().subscribe(data => {
      this.location = {...data['iss_position']};
    });
  }

  getCurrentTimestamp() {
    this.ISSInfoService.getLocationData().subscribe(data => {
      this.ISSTime = new Date();
      this.ISSTime.setTime(data.timestamp * 1000);
    });
  }

  getAstronauts() {
    this.ISSInfoService.getAstronauts().subscribe(data => {
      let astronautsArr = data.people;
      astronautsArr = astronautsArr.filter(astr => astr.craft === 'ISS');
      this.astronauts = {people: astronautsArr, number: astronautsArr.length};
    });
  }

  initMap(latitude, longitude) {
    const coordinates = {lat: latitude, lng: longitude};
    const map = new google.maps.Map(
      this.mapRef.nativeElement, {zoom: 4, center: coordinates});
    const marker = new google.maps.Marker({position: coordinates, map: map});
  }
}
