import { Component, OnInit } from '@angular/core';
import { Map, latLng, tileLayer, Layer, marker,Marker, icon, layerGroup } from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Platform } from '@ionic/angular';
import {PokemonService} from "../../services/pokemon.service";


@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  map: Map;
  locationMarker: marker;
  spawnedPokemon = [];
  ownLoc = [];
  constructor(private geolocation: Geolocation, private platform: Platform, private pokemonService: PokemonService) {
    this.platform.ready().then(() => {
      this.getLocation();

    });
    this.spawnPokemons();

  }

  ngOnInit() {
  }

  ionViewDidLoad(){
    console.log("yeet")

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
      this.ownLoc.push(resp.coords.latitude, resp.coords.longitude);
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {

      this.removeMarker();
      this.addMarker(data.coords.latitude,data.coords.longitude);
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
    });
  }



  spawnPokemons(){
    for(let i = 0; i< 10; i++){
      // @ts-ignore
      let randomPokemonIndex = Math.floor((Math.random() * 125) + 1);
      this.pokemonService.getPokeDetails(randomPokemonIndex).subscribe(res =>{
        let pokemon = res;
        let coords = this.generateNearbyLocation(parseFloat(this.ownLoc[0]), parseFloat(this.ownLoc[1]))
        let newPokemon = {
          'Latitude': coords[0], 'Longitude': coords[1], 'Pokemon': pokemon.name,
          'ImgURL': pokemon.images[2], 'Id': pokemon.id
        };
        this.spawnedPokemon.push(newPokemon);

        const iconDefault = icon({
          iconUrl:pokemon.images[2] ,
          iconSize: [35, 35], // size of the icon
          iconAnchor: [12,41],
          tooltipAnchor:[16,-28]
        })
        Marker.prototype.options.icon = iconDefault;
        Marker.prototype.options.icon = iconDefault;
        console.log(this.spawnedPokemon.length)
        let pokeMarker = marker([this.spawnedPokemon[i].Latitude, this.spawnedPokemon[i].Longitude], {
          draggable:
              false
        });
        pokeMarker.addTo(this.map);

      })
    }
  }


  addPokeMarkers(iconUrl){

    console.log(this.spawnedPokemon)
    for(let i = 0; i< this.spawnedPokemon.length;i ++){
      const iconDefault = icon({
        iconUrl,
        iconSize: [35, 35], // size of the icon

        iconAnchor: [12,41],
        tooltipAnchor:[16,-28]
      })
      Marker.prototype.options.icon = iconDefault;
      let pokeMarker = marker([this.spawnedPokemon[i].Latitude, this.spawnedPokemon[i].Longitude], {
        draggable:
            false
      });
      pokeMarker.addTo(this.map);
    }
  }

  generateNearbyLocation(lat,lng){

    var r = 100/111300 // = 100 meters
        , y0 = lat
        , x0 = lng
        , u = Math.random()
        , v = Math.random()
        , w = r * Math.sqrt(u)
        , t = 2 * Math.PI * v
        , x = w * Math.cos(t)
        , y1 = w * Math.sin(t)
        , x1 = x / Math.cos(y0)

     var newY = y0 + y1
    var newX = x0 + x1


      return [parseFloat(newY),parseFloat(newX)]
    let minLat = lat-0.300000000000000;
    let maxLat = lat+0.300000000000000;

    let minLong = lng+0.300000000000000;
    let maxLong = lng+0.300000000000000;
    // max-min) +min
    var randomLat =  this.getRandomNum(minLat, maxLat);
    var randomLon = this.getRandomNum(minLong, maxLong);
    console.log(lat,lng)

    return [randomLat, randomLon];
  }

  getRandomNum(min,max){
    return Math.random() * (min - max) + min;
  }


}
