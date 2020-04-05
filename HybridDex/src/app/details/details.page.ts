import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PokemonService} from '../services/pokemon.service';
import {NetworkService} from '../services/network.service';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  details :any;
  slideOpts = {
    autoplay:{
      delay: 1000,
      disableOnInteraction: false,
    }
  };

  constructor(private  route: ActivatedRoute, private pokeService: PokemonService, private network: NetworkService, private toastController: ToastController) { }

  ngOnInit() {
    if(this.network.isConnected()){
      let index = this.route.snapshot.paramMap.get('id');
      this.pokeService.getPokeDetails(index).subscribe(details =>{
        this.details = details;
      })
    }else{
      this.presentToast('No Internet, try again launching the app again, when you have internet connection.', 5000);

    }

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
