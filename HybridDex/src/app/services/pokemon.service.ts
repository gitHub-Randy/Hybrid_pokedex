import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {error} from "util";
import {createUrlResolverWithoutPackagePrefix} from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  baseUrl = 'https://pokeapi.co/api/v2';
//https://www.serebii.net/pokemongo/pokemon/001.shtml
    imageUrlBase = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"
  imageUrlGO = 'https://www.serebii.net/pokemongo/pokemon/';

  constructor( private http: HttpClient) {

  }

  getPokemon(offset = 0) {
    return this.http
        .get(`${this.baseUrl}/pokemon?offset=${offset}&limit=25`)
        .pipe(
            map(result => {
              return result['results'];
            }),
            map(pokemon => {
              return pokemon.map((poke, index) => {
                poke.image = this.getPokeImage(offset + index + 1);
                poke.pokeIndex = offset + index + 1;
                return poke;
              });
            })
        );
  }

  getPokeImage(index){

    return `${this.imageUrlGO}${this.getRightIndexFormat(index)}.png`
  }

  findPokemon(search){
    return this.http.get(`${this.baseUrl}/pokemon/${search}`).pipe(
        map(pokemon => {
            pokemon['image'] = this.getPokeImage(pokemon['id']);
            pokemon['pokeIndex'] = pokemon['id'];
            return pokemon;
        })
    )
  }

  getPokeDetails(index){
      return this.http.get(`${this.baseUrl}/pokemon/${index}`).pipe(

          map(poke => {
              let sprites = Object.keys(poke['sprites']);

              poke['images'] = sprites
                  .map(spriteKey =>poke['sprites'] [spriteKey])
                  .filter(img =>img).reverse();
              return poke;
          })
      )
  }




  getRightIndexFormat(index){
      if(index < 10){
          index = "00"+index
      }else if(index < 100 && index > 9){
          index = "0"+index
      }
      return index;
  }





}
