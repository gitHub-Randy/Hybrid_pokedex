import {Component, OnInit, ViewChild} from '@angular/core';
import {IonInfiniteScroll, IonReorderGroup, ToastController} from '@ionic/angular';
import {PokemonService} from '../../services/pokemon.service';

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

  constructor(private pokeService: PokemonService, private toastController: ToastController) {
  }

  ngOnInit(): void {
    this.loadPokemon();
  }

  loadPokemon(loadMore = false, event?){
    if(loadMore){
      this.offset += 25;
    }
    this.pokeService.getPokemon(this.offset).subscribe(res => {
      console.log('result: ', res);
      this.pokemon = [...this.pokemon, ...res];
      if (event){
        event.target.complete();
      }
      if(this.offset == 125){
        this.infinite.disabled = true;
      }
    });

  }

  onSearchChange(e){
    let value = e.detail.value;
    if(value == ''){
      this.offset = 0;
      this.loadPokemon();
      return;
    }

    this.pokeService.findPokemon(value).subscribe(res =>{
      this.pokemon = [res];
    }, err =>{
      this.pokemon = [];
    })
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
    toast.present();
  }

}
