import {Component, OnInit, ViewChild} from '@angular/core';
import {IonInfiniteScroll, IonReorderGroup, ToastController} from '@ionic/angular';
import {PokemonService} from '../../services/pokemon.service';
import {Subscription} from 'rxjs';
import {NetworkService} from '../../services/network.service';

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

  constructor(private pokeService: PokemonService, private toastController: ToastController, private network: NetworkService) {
  }

  connectSubscription: Subscription;

  ngOnInit(): void {
  }


  ionViewDidLeave() {

  }

  ionViewDidEnter() {
      this.loadPokemon();
  }

  loadPokemon(loadMore = false, event ?) {
    console.log(this.network.isConnected());
    if (this.network.isConnected()) {
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
    } else {
      this.presentToast('No Internet, try again launching the app again, when you have internet connection.', 5000);
    }
  }

  onSearchChange(e) {
    const value = e.detail.value;
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
    console.log(' YEET');
    const toast = await this.toastController.create({
      message,
      duration
    });
    toast.present();
  }
}
