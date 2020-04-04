import {Component, OnInit} from '@angular/core';
import {icon, Map, Marker, marker, tileLayer} from 'leaflet';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {AlertController, NavController, Platform} from '@ionic/angular';
import {PokemonService} from '../../services/pokemon.service';
import {map, timeout} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import { NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage';
import {Network} from '@ionic-native/network/ngx';

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
    pokeServiceSubscription: Subscription;
    locationSubscription: Subscription;
    pokemonToCatch: any = {};
    pokeMarkers: marker = [];

    constructor(private geolocation: Geolocation, private platform: Platform, private pokemonService: PokemonService, private network: Network, private alertController: AlertController, private router: Router , private navCtrl: NavController, private storage: Storage) {
    }

    ngOnInit() {
    }

    ionViewDidLoad(){
        console.log("ionViewDidLoad")
    }
    ionViewWillEnter(){
        console.log("ionViewWillEnter")

    }
    ionViewWillLeave(){
        console.log("ionViewWillLeave")

    }

    ionViewWillUnload(){
        console.log("ionViewWillUnload")

    }
    ionViewCanEnter(){
        console.log("ionViewCanEnter")

    }
    ionViewCanLeave(){
        console.log("ionViewCanLeave")

    }

    ionViewDidLeave(){
        console.log("yeeting")
        this.locationSubscription.unsubscribe();
        this.ownLoc = [];
        this.spawnedPokemon = [];
        this.map.remove();
    }

     subscribeToLocation(spawnedPokemon){
        console.log("whooopp")
        this.locationSubscription =  this.watchLoc().subscribe(data => {
            console.log(" LOGGINGS")
            this.ownLoc[0] = data.coords.latitude.toFixed(7);
            this.ownLoc[1] = data.coords.longitude.toFixed(7);
            this.map.setView(this.ownLoc);
            this.removeMarker();
            this.addMarker(data.coords.latitude, data.coords.longitude);
            console.log("Before")
            this.checkIfPokemonToCatch(spawnedPokemon)
        });
    }

    async checkIfPokemonToCatch(spawnedPokemon){
        spawnedPokemon.forEach(value => {
            if(this.calculateDistance(this.ownLoc[0], this.ownLoc[1], value.Latitude, value.Longitude) <= 25){
                this.pokemonToCatch = value;
                if(!this.hasCatched){
                    this.hasCatched = true;
                     this.pokemonCatchConfirm().then((data) =>{
                     });


                }
            }
        });
    }


    ionViewDidEnter() {
        const connectSubscription = this.network.onConnect().subscribe();

        if (connectSubscription) {
            console.log("yeeting IN");
            this.subscribeToLocation(this.spawnedPokemon);
            this.leafletMap(this.ownLoc[0], this.ownLoc[1]);
            // this.test();
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
            this.presentOfflineAlert();
        }

        connectSubscription.unsubscribe();
    }

    leafletMap(lat,lng) {
        this.map = new Map('map').setView([0, 0], 17);
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

    }

    setLocationMarker() {
        var iconUrl = '../../assets/trainer.png';
        var shadowUrl = '../../assets/marker-shadow.png';
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
            let watch = this.geolocation.watchPosition({enableHighAccuracy: true});
            return watch.pipe(
                map(data => {
                    return data;
                })
            );
        } catch (e) {
            return e;
        }
    }




    async checkNotAsync(){
        let array : Array<any> = [];
        for(let i = 0; i< 10;i++) {
             await this.storage.get(`pokemon${i}`).then((data)=>{
                if(data != null){
                    array.push(data);
                    this.spawnedPokemon.push(data)

                }
             });

        }
        return array;
    }

   async getPokemon(){
       let array:Array<any> = [];

       for(let i = 0; i< 10;i++) {
           let randomPokemonIndex = Math.floor((Math.random() * 125) + 1);
           await this.pokemonService.getPokeDetails(randomPokemonIndex).toPromise().then((data) =>{
               let pokemon: any = data;
               let coords = this.generateNearbyLocation(parseFloat(this.ownLoc[0]), parseFloat(this.ownLoc[1]));
               let newPokemon = {
                   'Latitude': coords[0], 'Longitude': coords[1], 'Pokemon': pokemon.name,
                   'ImgURL': pokemon.images[3], 'Id': pokemon.id
               };
               this.storage.set(`pokemon${i}`, newPokemon);
               this.spawnedPokemon.push(newPokemon);
               array.push(newPokemon);
           })

       }
       return array;

    }

    async generatePokemon() {
        return  new Promise(res =>{
                 this.getPokemon().then((data) =>{
                     res(data);
                });
        })
    }



     makePokeMarker(data) {
        for(let i =0; i< data.length;i++){
            const iconDefault = icon({
                iconUrl: data[i].ImgURL,
                iconSize: [50, 50], // size of the icon
                iconAnchor: [12, 41],
                tooltipAnchor: [16, -28]
            });
            Marker.prototype.options.icon = iconDefault;
            Marker.prototype.options.icon = iconDefault;
            let pokeMarker = marker([data[i].Latitude, data[i].Longitude], {
                draggable:
                    false
            });
            pokeMarker.addTo(this.map);
            this.pokeMarkers.push(pokeMarker);
        }
    }




    generateNearbyLocation(lat, lng) {
        var radius = Math.sqrt(10) * 100;
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
                    handler: (blah) => {
                        this.hasCatched = false;
                        this.subscribeToLocation(this.spawnedPokemon);

                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Catch',
                    handler: () => {
                        this.locationSubscription.unsubscribe();
                        this.ownLoc = [];
                        this.spawnedPokemon = [];
                        this.map.remove();
                            let navigationExtras: NavigationExtras = {
                            queryParams: {
                                pokemon: this.pokemonToCatch

                            }
                        };
                        this.navCtrl.navigateRoot('/catch', navigationExtras);
                        console.log('Confirm Okay');
                    }
                }
            ]
        });

        await alert.present();
    }





    removePokemonMarkers(pokemonToRemove){
        return new Promise((res)=>{
                for (let x = 0; x < this.pokeMarkers.length; x++) {
                    if (this.pokeMarkers[x]._latlng.lat == pokemonToRemove.Latitude && this.pokeMarkers[x]._latlng.lng == pokemonToRemove.Longitude) {

                        this.map.removeLayer(this.pokeMarkers[x]);
                        this.pokeMarkers.splice(x, 1);
                        return res
                    }
                }
            })
    }


    async getPokemonFromStorage(key:string): Promise<void>{
        return await this.storage.get(key);
    }
    async removePokemonFromStorage(pokemon): Promise<void>{
        for(let i = 0; i< 10; i++){
            this.getPokemonFromStorage(`pokemon${i}`).then((data: any) =>{
                if(data != null){
                    if(data.Latitude == pokemon.Latitude &&data.Longitude == pokemon.Longitude ) {

                        return  this.storage.remove(`pokemon${i}`);
                        }}})
        }
    }


    async pokemonDetailsConfirm() {
        const alert = await this.alertController.create({
            header: 'View pokemon',
            message: 'Do you want to view the details of this pokemon?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        this.pokemonToCatch = null;
                    }
                }, {
                    text: 'Yes',
                    handler: () => {
                        this.pokeServiceSubscription.unsubscribe();
                        this.locationSubscription.unsubscribe();
                        this.ownLoc = [];
                        this.spawnedPokemon = [];
                        this.map.remove();
                        let navigationExtras: NavigationExtras = {
                            queryParams: {
                                pokemon: this.pokemonToCatch
                            }
                        };
                        this.navCtrl.navigateRoot('/catch', navigationExtras);
                        console.log('Confirm Okay');
                    }
                }
            ]
        });

        await alert.present();
    }

    async presentOfflineAlert() {
        const alert = await this.alertController.create({
            header: 'No Internet',
            subHeader: 'ERROR',
            message: 'Try again launching the app again, when you have internet connection.',
            buttons: ['OK']
        });

        await alert.present();
    }

    setHasCatchedToFalse(){
        setTimeout(() =>{this.hasCatched = false},1000);
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c) * 1000; // Distance in km
    }

    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }



}
