import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PokemonService} from "../../services/pokemon.service";
import { Storage } from '@ionic/storage';
import {NavController, ToastController} from '@ionic/angular';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {NetworkService} from '../../services/network.service';

@Component({
  selector: 'app-catched-details',
  templateUrl: './catched-details.page.html',
  styleUrls: ['./catched-details.page.scss'],
})
export class CatchedDetailsPage implements OnInit {
  details :any;
  slideOpts = {
    autoplay:{
      delay: 1000,
      disableOnInteraction: false,
    }
  };
  catchedPokemon:any;
   index;
   nickName;
  currentImage: any;

  constructor(private  route: ActivatedRoute,private camera: Camera,private pokeService: PokemonService,private storage:Storage,private navCtrl: NavController, private network: NetworkService, private toastController: ToastController) { }

  ngOnInit() {
     this.index = this.route.snapshot.paramMap.get('id');
     console.log(this.index)
    this.catchedPokemon =  this.storage.get(`catchedPokemon${this.index}`).then((data) =>{
      this.nickName = data.NickName
      this.currentImage = data.CustomPhoto;
      if(this.network.isConnected()){
        this.pokeService.getPokeDetails(data.Id).subscribe(details =>{
          this.details = details;
        })
      }else{
        this.presentToast('No Internet, try again launching the app again, when you have internet connection.', 5000);

      }

     }).then(() =>{
       console.log(this.catchedPokemon);
    })


  }

  saveNickName(){
    console.log(this.catchedPokemon);
    this.storage.get(`catchedPokemon${this.index}`).then((data) =>{
      let pokemon = {
        Latitude: data.Latitude,
        Longitude: data.Longitude,
        Id: data.Id,
        Pokemon: data.Pokemon,
        ImgURL: data.ImgURL,
        CustomPhoto: data.CustomPhoto,
        NickName: this.nickName,
        CatchId: data.CatchId
      };
      this.storage.set(`catchedPokemon${this.index}`, pokemon);
    })
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
      this.catchedPokemon.CustomPhoto = this.currentImage;
      this.storage.get(`catchedPokemon${this.index}`).then((data) =>{
        let pokemon = {
          Latitude: data.Latitude,
          Longitude: data.Longitude,
          Id: data.Id,
          Pokemon: data.Pokemon,
          ImgURL: data.ImgURL,
          CustomPhoto: this.currentImage,
          NickName: this.nickName,
          CatchId: data.CatchId
        };
        this.storage.set(`catchedPokemon${this.index}`, pokemon);
      })

    }, (err) => {
      // Handle error
      console.log('Camera issue:' + err);
    });
  }


  async presentToast(message, duration) {
    console.log(" YEET")
    const toast = await this.toastController.create({
      message,
      duration
    });
    await toast.present();
  }

}
