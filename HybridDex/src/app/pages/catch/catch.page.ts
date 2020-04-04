import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';

@Component({
  selector: 'app-catch',
  templateUrl: './catch.page.html',
  styleUrls: ['./catch.page.scss'],
})
export class CatchPage implements OnInit {
  pokemon: any = {
    Latitude: 0,
    Longitude: 0,
    Id: 0,
    Pokemon: "",
    ImgURL: "",
    CustomPhoto: "",
    NickName: "",
    CatchId: 0
  }
  currentImage: any;
  storedPhoto: any;
  displayImage: any;


  constructor(private route: ActivatedRoute, private camera: Camera, private storage: Storage,private file: File,private webview: WebView) {
    this.route.queryParams.subscribe(params => {
      this.pokemon.Latitude = params.pokemon.Latitude;
      this.pokemon.Longitude = params.pokemon.Longitude;
      this.pokemon.Id = params.pokemon.Id;
      this.pokemon.Pokemon = params.pokemon.Pokemon;
      this.pokemon.ImgURL = params.pokemon.ImgURL;

      console.log(params.pokemon.Pokemon);
      console.log(this.pokemon);
      this.removePokemonFromStorage(this.pokemon);
      this.addToCathesStorage(this.pokemon);

    });
  }

  ngOnInit() {
  }

  async takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true


    };


    this.camera.getPicture(options).then((imageData) => {

      this.currentImage = 'data:image/jpeg;base64,' + imageData;
      this.pokemon.CustomPhoto = this.currentImage;
      this.storage.set(`catchedPokemon${this.pokemon.CatchId}`, this.pokemon);

    }, (err) => {
      // Handle error
      console.log('Camera issue:' + err);
    });
  }

  async getPokemonFromStorage(key:string): Promise<void>{
    return await this.storage.get(key);
  }
  async removePokemonFromStorage(pokemon): Promise<void>{
    for(let i = 0; i< 10; i++){
      this.getPokemonFromStorage(`pokemon${i}`).then((data: any) =>{
        if(data != null){
          if(data.Latitude == this.pokemon.Latitude &&data.Longitude == this.pokemon.Longitude ) {
            console.log("delete storage")
            return  this.storage.remove(`pokemon${i}`).then(()=>console.log("removed "+data.Pokemon));
          }}})
    }
  }



  async addToCathesStorage(pokemon: any) {
    let id;
     await this.storage.get("amountCatchedPokemons").then((data) =>{
      if(data == null){
        id = 0;
      }else{
        console.log(data)
        id = data;
      }
       console.log(id);
      this.pokemon.CatchId = (id+1);
        this.storage.set("amountCatchedPokemons", (id+1)).then(() =>{
         this.storage.set(`catchedPokemon${(id+1)}`, this.pokemon);

       })
    })

  }
}
