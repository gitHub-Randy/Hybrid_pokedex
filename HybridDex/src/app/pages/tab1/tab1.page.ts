import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertController, IonInfiniteScroll, IonReorderGroup, ToastController} from '@ionic/angular';
import {PokemonService} from '../../services/pokemon.service';
import {Network} from '@ionic-native/network/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  offset = 0;
  pokemon = [];
  @ViewChild(IonInfiniteScroll, null) infinite: IonInfiniteScroll;
  // @ts-ignore
  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;

  constructor(private pokeService: PokemonService, private toastController: ToastController, private network: Network, private alertController: AlertController) {
  }

  ngOnInit(): void {
    const connectSubscription = this.network.onConnect().subscribe();

    if (connectSubscription) {
      this.loadPokemon();
    } else {
      this.presentOfflineAlert();
    }

    connectSubscription.unsubscribe();
  }

  loadPokemon(loadMore = false, event ?) {
    if (loadMore) {
      this.offset += 25;
    }
    this.pokeService.getPokemon(this.offset).subscribe(res => {
      console.log('result: ', res);
      this.pokemon = [...this.pokemon, ...res];
      if (event) {
        event.target.complete();
      }
      if (this.offset == 125) {
        this.infinite.disabled = true;
      }
    });

  }

  onSearchChange(e) {
    let value = e.detail.value;
    if (value == '') {
      this.offset = 0;
      this.loadPokemon();
      return;
    }

    this.pokeService.findPokemon(value).subscribe(res => {
      this.pokemon = [res];
    }, err => {
      this.pokemon = [];
    });
  }

  doReorder(ev: any) {
    ev.detail.complete();
  }

  toggleReorderGroup() {
    this.reorderGroup.disabled = !this.reorderGroup.disabled;
  }

  async presentToast(name) {
    const toast = await this.toastController.create({
      message: 'You selected ' + name + '!',
      duration: 2000
    });
    await toast.present();
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

}
