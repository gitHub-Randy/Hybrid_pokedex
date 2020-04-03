import {Component, OnInit, ViewChild} from '@angular/core';
import {IonInfiniteScroll, IonReorderGroup} from '@ionic/angular';
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
  constructor(private pokeService: PokemonService) {}

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
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete();
  }

  toggleReorderGroup() {
    this.reorderGroup.disabled = !this.reorderGroup.disabled;
  }

}
