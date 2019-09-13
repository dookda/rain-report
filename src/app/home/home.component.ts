import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';


import * as L from 'leaflet';
import { MarkerService } from '../marker.service';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public map: any;
  public rainForm: FormGroup;
  public rainData: Rain;
  public latlon: any;
  public hero: any;

  public file: File;
  public ref: any;
  public task: any;
  public uploadProgress: any;
  public imgUrl: any;

  constructor(
    public fb: FormBuilder,
    public firestore: AngularFirestore,
    public storage: AngularFireStorage,
    public markerService: MarkerService
  ) {
    this.rainForm = this.fb.group({
      rain: ['', Validators.required],
      reporter: ['', Validators.required],
      images: ['',]
    });
  }

  ngOnInit() {
    this.getLocation();
    this.loadMap();
    this.onInit();
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.latlon = { lat: position.coords.latitude, lon: position.coords.longitude };
      // console.log(position.coords.latitude, position.coords.longitude);
    });
  }

  async loadMap() {
    this.map = new L.Map('map', {
      center: [17.707829, 100.002905],
      zoom: 10
    });

    const grod = L.tileLayer('http://{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    const ghyb = L.tileLayer('http://{s}.google.com/vt/lyrs=y,m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    const gter = L.tileLayer('http://{s}.google.com/vt/lyrs=t,m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    // overlay map
    const cgiUrl = 'http://www.cgi.uru.ac.th/geoserver/ows?';

    const pro = L.tileLayer.wms(cgiUrl, {
      layers: 'th:province_4326',
      format: 'image/png',
      transparent: true,
      zIndex: 5,
      CQL_FILTER: 'pro_code=53 OR pro_code=54 OR pro_code=65 OR pro_code=64'
    });

    const amp = L.tileLayer.wms(cgiUrl, {
      layers: 'th:amphoe_4326',
      format: 'image/png',
      transparent: true,
      zIndex: 5,
      CQL_FILTER: 'pro_code=53 OR pro_code=54 OR pro_code=65 OR pro_code=64'
    });

    const tam = L.tileLayer.wms(cgiUrl, {
      layers: 'th:tambon_4326',
      format: 'image/png',
      transparent: true,
      zIndex: 5,
      CQL_FILTER: 'pro_code=53 OR pro_code=54 OR pro_code=65 OR pro_code=64'
    });

    const baseMap = {
      แผนที่ถนน: grod,
      แผนที่ภูมิประเทศ: gter.addTo(this.map),
      แผนที่ผสม: ghyb
    };

    const overLay = {
      ขอบเขตจังหวัด: pro.addTo(this.map),
      ขอบเขตอำเภอ: amp.addTo(this.map),
      ขอบเขตตำบล: tam.addTo(this.map),
    };

    L.control.layers(baseMap, overLay).addTo(this.map);
  }

  onInit() {
    const blueIcon = L.icon({
      iconUrl: this.markerService.blueIcon,
      iconSize: [32, 32],
      iconAnchor: [12, 37],
      popupAnchor: [5, -30]
    });
    const greenIcon = L.icon({
      iconUrl: this.markerService.greenIcon,
      iconSize: [32, 32],
      iconAnchor: [12, 37],
      popupAnchor: [5, -30]
    });
    const yellowIcon = L.icon({
      iconUrl: this.markerService.yellowIcon,
      iconSize: [32, 32],
      iconAnchor: [12, 37],
      popupAnchor: [5, -30]
    });
    const redIcon = L.icon({
      iconUrl: this.markerService.redIcon,
      iconSize: [32, 32],
      iconAnchor: [12, 37],
      popupAnchor: [5, -30]
    });

    let marker: any;
    // let imgUrl: any;

    this.firestore.collection('rain').get().subscribe((data: any) => {
      this.hero = data.docs.map((doc: any) => ({ ...doc.data() }));

      if (marker) {
        this.map.removeLayer(marker);
      }

      this.hero.forEach(async (poi: any) => {
        // console.log(poi.rain);
        const latlng = L.latLng(poi.lat, poi.lon);

        if (poi.rain < 50) {
          marker = L.marker(latlng, { icon: blueIcon, iconName: 'strmSta' });
        } else if (poi.rain < 100) {
          marker = L.marker(latlng, { icon: greenIcon, iconName: 'strmSta' });
        } else if (poi.rain < 150) {
          marker = L.marker(latlng, { icon: yellowIcon, iconName: 'strmSta' });
        } else {
          marker = L.marker(latlng, { icon: redIcon, iconName: 'strmSta' });
        }

        marker.bindPopup(`ปริมาณน้ำฝน ${poi.rain} มม.<br> ผู้รายงาน ${poi.reporter}`).openPopup();

        marker.addTo(this.map);

      });

      this.map.setView(this.latlon, 16, { animation: true });
    });
  }

  onSelect(e: any) {
    this.file = e.target.files[0];
  }

  onSubmit() {
    this.rainData = this.rainForm.value;
    this.rainData.lat = this.latlon.lat;
    this.rainData.lon = this.latlon.lon;
    if (this.file) {
      const imgId = `imgs/_${Date.now()}_${this.file.name}`;
      this.ref = this.storage.ref(imgId);
      this.task = this.ref.put(this.file);
      // this.uploadProgress = this.task.percentageChanges();
      this.rainData.img = imgId;
      this.firestore.collection('rain').add(this.rainForm.value);
    } else {
      this.firestore.collection('rain').add(this.rainForm.value);
    }
    this.rainForm.reset();
    this.onInit();
  }

  onEdit() {
    // TO DO
  }

  onDelete() {
    // TO DO
  }

}

export class Rain {
  rain: number;
  reporter: string;
  desc: string;
  lat?: number;
  lon?: number;
  img?: string;
}
