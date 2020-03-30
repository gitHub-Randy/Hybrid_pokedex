import { Component, OnInit } from '@angular/core';
import { Map, latLng, tileLayer, Layer, marker,Marker, icon, layerGroup } from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';


@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  map: Map;
  locationMarker: marker;
  constructor(private geolocation: Geolocation) {
    this.getLocation();
  }

  ngOnInit() {
  }


  ionViewDidEnter() { this.leafletMap(); }

  leafletMap() {
    // In setView add latLng and zoom
    this.map = new Map('map').setView([51.877229,5.523009], 17);
    tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

  }



  setLocationMarker(){
    var iconUrl = '../../assets/trainer.png';
    var shadowUrl = '../../assets/marker-shadow.png';
    const iconDefault = icon({
      iconUrl,
      iconSize:     [35, 35], // size of the icon

      iconAnchor: [12,41],
      tooltipAnchor:[16,-28]
    })
    Marker.prototype.options.icon = iconDefault;
  }

    addMarker(latitude,longitude){
    this.setLocationMarker();
      this.locationMarker = marker([latitude, longitude], {
        draggable:
            false
      });
      this.locationMarker.addTo(this.map);
    }

    removeMarker(){
    if(this.locationMarker != null)
    this.map.removeLayer(this.locationMarker);
    }


  /** Remove map when we have multiple map object */
  ionViewWillLeave() {
    this.map.remove();
  }

  getLocation(){
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      console.log(data.coords);
      this.removeMarker();
      this.addMarker(data.coords.latitude,data.coords.longitude);
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
    });
  }
}
