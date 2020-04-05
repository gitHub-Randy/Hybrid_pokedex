import {Component, OnInit} from '@angular/core';
import {icon, Map, Marker, marker, tileLayer} from 'leaflet';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {AlertController, NavController, Platform, ToastController} from '@ionic/angular';
import {PokemonService} from '../../services/pokemon.service';
import {map} from 'rxjs/operators';
import {NavigationExtras, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Storage} from '@ionic/storage';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {NetworkService} from '../../services/network.service';
import {Diagnostic} from '@ionic-native/diagnostic/ngx';

@Component({
    selector: 'app-tab2',
    templateUrl: './tab2.page.html',
    styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {
    map: Map;
    locationMarker: marker;
    spawnedPokemon: Array<any> = [];
    ownLoc = [];
    hasCatched: boolean;
    locationSubscription: Subscription;
    pokemonToCatch: any = {};
    pokeMarkers: marker = [];

    constructor(private geolocation: Geolocation, private platform: Platform, private pokemonService: PokemonService, private network: NetworkService, private alertController: AlertController, private router: Router, private toastController: ToastController, private navCtrl: NavController, private storage: Storage, private androidPermissions: AndroidPermissions, private diagnostic: Diagnostic) {
    }

    ngOnInit() {
    }

    ionViewDidLeave() {
        this.locationSubscription.unsubscribe();
        this.ownLoc = [];
        this.spawnedPokemon = [];
        this.map.remove();
    }

    ionViewDidEnter() {
        if (this.network.isConnected()) {
            this.checkPermission().then(() => {
                this.diagnostic.isLocationEnabled().then((data) => {
                    if (data === true) {
                        this.subscribeToLocation(this.spawnedPokemon);
                        this.leafletMap(this.ownLoc[0], this.ownLoc[1]);
                        this.checkNotAsync().then((data) => {
                            if (data[0] == null) {
                                this.generatePokemon().then((data) => {
                                    this.makePokeMarker(data);
                                });
                            }
                            this.makePokeMarker(data);
                        });

                        this.hasCatched = false;
                    } else {
                        this.presentToast('No GPS, turn GPS on and try launching the app again.', 5000);
                    }
                });
            });
        } else {
            this.presentToast('No Internet, try again launching the app again, when you have internet connection.', 5000);
        }
    }

    subscribeToLocation(spawnedPokemon) {
        this.locationSubscription = this.watchLoc().subscribe(data => {
            this.ownLoc[0] = data.coords.latitude.toFixed(7);
            this.ownLoc[1] = data.coords.longitude.toFixed(7);
            this.map.setView(this.ownLoc);
            this.removeMarker();
            this.addMarker(data.coords.latitude, data.coords.longitude);
            this.checkIfPokemonToCatch(spawnedPokemon);
        });
    }

    async checkIfPokemonToCatch(spawnedPokemon) {
        spawnedPokemon.forEach(value => {
            if (this.calculateDistance(this.ownLoc[0], this.ownLoc[1], value.Latitude, value.Longitude) <= 25) {
                this.pokemonToCatch = value;
                if (!this.hasCatched) {
                    this.hasCatched = true;
                    this.pokemonCatchConfirm().then((data) => {
                    });
                }
            }
        });
    }

    async checkPermission() {
        await this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION]).catch((error) => {
            this.presentToast('No GPS Permission, turn on GPS permission and try again launching the app again.', 5000);
        });
    }

    leafletMap(lat, lng) {
        this.map = new Map('map').setView([0, 0], 17);
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
    }

    setLocationMarker() {
        const iconUrl = '../../assets/trainer.png';
        const iconDefault = icon({
            iconUrl,
            iconSize: [35, 35], // size of the icon
            iconAnchor: [12, 41],
            tooltipAnchor: [16, -28]
        });
        Marker.prototype.options.icon = iconDefault;
    }

    addMarker(latitude, longitude) {
        this.setLocationMarker();
        this.locationMarker = marker([latitude, longitude], {
            draggable:
                false
        });
        this.locationMarker.addTo(this.map);
    }

    removeMarker() {
        if (this.locationMarker != null) {
            this.map.removeLayer(this.locationMarker);
        }
    }

    watchLoc() {
        try {
            const watch = this.geolocation.watchPosition({enableHighAccuracy: true});
            return watch.pipe(
                map(data => {
                    return data;
                })
            );
        } catch (e) {
            this.presentToast('No GPS, Turn GPS on and launching the app again.', 5000);
            return e;
        }
    }

    async checkNotAsync() {
        const array: Array<any> = [];
        for (let i = 0; i < 10; i++) {
            await this.storage.get(`pokemon${i}`).then((data) => {
                if (data != null) {
                    array.push(data);
                    this.spawnedPokemon.push(data);
                }
            });
        }
        return array;
    }

    async getPokemon() {
        const array: Array<any> = [];

        for (let i = 0; i < 10; i++) {
            const randomPokemonIndex = Math.floor((Math.random() * 125) + 1);
            await this.pokemonService.getPokeDetails(randomPokemonIndex).toPromise().then((data) => {
                const pokemon: any = data;
                const coords = this.generateNearbyLocation(parseFloat(this.ownLoc[0]), parseFloat(this.ownLoc[1]));
                const newPokemon = {
                    Latitude: coords[0], Longitude: coords[1], Pokemon: pokemon.name,
                    ImgURL: pokemon.images[0], Id: pokemon.id
                };
                this.storage.set(`pokemon${i}`, newPokemon);
                this.spawnedPokemon.push(newPokemon);
                array.push(newPokemon);
            });
        }
        return array;
    }

    async generatePokemon() {
        return new Promise(res => {
            this.getPokemon().then((data) => {
                res(data);
            });
        });
    }

     makePokeMarker(data) {
         for (let i = 0; i < data.length; i++) {
             const iconDefault = icon({
                 iconUrl: data[i].ImgURL,
                 iconSize: [50, 50], // size of the icon
                 iconAnchor: [12, 41],
                 tooltipAnchor: [16, -28]
             });
             Marker.prototype.options.icon = iconDefault;
             Marker.prototype.options.icon = iconDefault;
             const pokeMarker = marker([data[i].Latitude, data[i].Longitude], {
                 draggable:
                     false
             });
             pokeMarker.addTo(this.map);
             this.pokeMarkers.push(pokeMarker);
         }
     }

    generateNearbyLocation(lat, lng) {
        const radius = Math.sqrt(10) * 100;
        const y0 = lat;
        const x0 = lng;
        const rd = radius / 111300; // about 111300 meters in one degree
        const u = Math.random();
        const v = Math.random();
        const w = rd * Math.sqrt(u);
        const t = 2 * Math.PI * v;
        const x = w * Math.cos(t);
        const y = w * Math.sin(t);
        const newlat = y + y0;
        const newlon = x + x0;
        return [parseFloat(newlat).toFixed(7), parseFloat(newlon).toFixed(7)];
    }

    async pokemonCatchConfirm() {
        this.hasCatched = true;
        const alert = await this.alertController.create({
            header: 'Catch Pokemon',
            message: 'Do you want to catch this pokemon?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        this.hasCatched = false;
                        this.subscribeToLocation(this.spawnedPokemon);
                    }
                }, {
                    text: 'Catch',
                    handler: () => {
                        this.locationSubscription.unsubscribe();
                        this.ownLoc = [];
                        this.spawnedPokemon = [];
                        this.map.remove();
                        const navigationExtras: NavigationExtras = {
                            queryParams: {
                                pokemon: this.pokemonToCatch
                            }
                        };
                        this.navCtrl.navigateRoot('/catch', navigationExtras);
                    }
                }
            ]
        });

        await alert.present();
    }

    async presentToast(message, duration) {
        const toast = await this.toastController.create({
            message,
            duration
        });
        await toast.present();
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the earth in km
        const dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c) * 1000; // Distance in m
    }

    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
}
