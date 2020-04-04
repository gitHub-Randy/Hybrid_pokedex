import {Component, OnInit, ViewChild} from '@angular/core';
import {IonInfiniteScroll, IonReorderGroup, ToastController} from '@ionic/angular';
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

  constructor(private pokeService: PokemonService, private toastController: ToastController, private network: Network) {
  }

  ngOnInit(): void {
    const connectSubscription = this.network.onConnect().subscribe();

    if (connectSubscription) {
      this.loadPokemon();
    } else {
      this.presentToast('No Internet, try again launching the app again, when you have internet connection.', 5000);
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

  async presentToast(message, duration) {
    const toast = await this.toastController.create({
      message,
      duration
    });
    await toast.present();
  }

}
