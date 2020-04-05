import {Component, OnDestroy, OnInit} from '@angular/core';
import { Storage } from '@ionic/storage';
import {PokemonService} from '../../services/pokemon.service';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit,OnDestroy  {
    catchedPokemons: Array<any> = [];
    pokeImage:Array<any> = []
  constructor(private storage: Storage, private pokeService: PokemonService) {

  }

  ngOnInit() {
    this.loadPokemon();

  }




    async loadPokemon() {
      await this.storage.get("amountCatchedPokemons").then((data) =>{
          console.log(data)
          for(let i = 1; i<= data; i++){
              console.log("catchedPokemon"+(i));
               this.storage.get("catchedPokemon"+(i)).then((data)=>{
                   console.log(data)

                  this.catchedPokemons.push(data)

              })
              this.pokeService.findPokemon(data.Id).subscribe(res =>{
                  this.pokeImage.push([res]);
              }, err =>{
              })
          }
      })
       console.log(this.catchedPokemons);
      console.log(this.pokeImage)
  }

    ngOnDestroy(): void {
      console.log("WOOOT")
    }

    async DeletePokemon(poke,index) {
       await this.storage.remove(`catchedPokemon${poke.CatchId}`);
        this.catchedPokemons.splice(index,1);
        await this.storage.get("amountCatchedPokemons").then((data) => {
            let id = data
             this.storage.set("amountCatchedPokemons", (id-1))
        });
        }
}
