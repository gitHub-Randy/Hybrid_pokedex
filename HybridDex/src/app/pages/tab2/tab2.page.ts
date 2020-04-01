import { Component, OnInit } from '@angular/core';
import { Map, latLng, tileLayer, Layer, marker,Marker, icon, layerGroup } from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Platform } from '@ionic/angular';
import {PokemonService} from "../../services/pokemon.service";
import { AlertController } from '@ionic/angular';
import {map} from "rxjs/operators";


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
  constructor(private geolocation: Geolocation, private platform: Platform, private pokemonService: PokemonService, private alertController: AlertController) {
    this.platform.ready().then(() => {
      // this.getLocation();

    });
    this.spawnPokemons();

  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'This is an alert message.',
      buttons: ['OK']
    });

    await alert.present();
  }
  ngOnInit() {
  }

  ionViewDidLoad(){
    console.log("yeet")

    }

  ionViewDidEnter() {
    this.leafletMap();

    this.watchLoc().subscribe(data =>{
      this.ownLoc.push(data.coords.latitude.toFixed(7), data.coords.longitude.toFixed(7));

      this.removeMarker();
      this.addMarker(data.coords.latitude,data.coords.longitude);
      this.spawnedPokemon.forEach(value =>{
        console.log(this.ownLoc[0], this.ownLoc[1], " OWN ")
        console.log(value.Latitude, value.Longitude, `${ value.Pokemon}`)
        if(this.ownLoc[0] == value.Latitude && this.ownLoc[1] == value.Longitude){
          this.presentAlert()
        }
      })
    })
    }

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

  // getLocation(){
  //   this.geolocation.getCurrentPosition({timeout: 3000}).then((resp) => {
  //   }).catch((error) => {
  //     console.log('Error getting location', error);
  //   });
  //   let watch = this.geolocation.watchPosition();
  //   watch.subscribe((data) => {
  //
  //
  //   });
  // }


  watchLoc(){
    try{
      let watch = this.geolocation.watchPosition({enableHighAccuracy: true});
      return watch.pipe(
          map(data =>{
            return data;
          })
      );
    }catch (e) {
      return  e;
    }
  }


  spawnPokemons(){
    for(let i = 0; i< 1; i++){
      // @ts-ignore
      let randomPokemonIndex = Math.floor((Math.random() * 125) + 1);

  // this.pokemonService.getPokeDetails(randomPokemonIndex).then()
      this.pokemonService.getPokeDetails(randomPokemonIndex).subscribe(res =>{
        let pokemon: any = res;
        let coords = this.generateNearbyLocation(parseFloat(this.ownLoc[0]), parseFloat(this.ownLoc[1]))
        let newPokemon = {
          'Latitude': coords[0], 'Longitude': coords[1], 'Pokemon': pokemon.name,
          'ImgURL': pokemon.images[3], 'Id': pokemon.id
        };

        this.spawnedPokemon.push(newPokemon);
        const iconDefault = icon({
          iconUrl: newPokemon.ImgURL,
          iconSize: [50, 50], // size of the icon
          iconAnchor: [12,41],
          tooltipAnchor:[16,-28]
        })
        Marker.prototype.options.icon = iconDefault;
        Marker.prototype.options.icon = iconDefault;
        console.log(i, "INDEX")
        let pokeMarker = marker([newPokemon.Latitude, newPokemon.Longitude], {
          draggable:
              false
        });
        pokeMarker.addTo(this.map);
      })
      // this.presentAlert()


    }

  }





  generateNearbyLocation(lat,lng){
    return [parseFloat(lat).toFixed(7),parseFloat(lng).toFixed(7)]
    var radius = Math.sqrt(0.1) * 100
    var y0 = lat;
    var x0 = lng;
    var rd = radius / 111300; //about 111300 meters in one degree
    var u = Math.random();
    var v = Math.random();
    var w = rd * Math.sqrt(u);
    var t = 2 * Math.PI * v;
    var x = w * Math.cos(t);
    var y = w * Math.sin(t);
    var newlat = y + y0;
    var newlon = x + x0;

    return [parseFloat(newlat).toFixed(7),parseFloat(newlon).toFixed(7)]

  }



}
