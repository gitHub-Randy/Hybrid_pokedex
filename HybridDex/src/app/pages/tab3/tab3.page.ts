import {Component, OnDestroy, OnInit} from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit,OnDestroy  {
    catchedPokemons: Array<any> = [];
  constructor(private storage: Storage) {
      console.log("333333")

  }

  ngOnInit() {
    this.loadPokemon();
    console.log("fdsafasdfadsf")

  }

    ionViewDidLoad(){
        console.log("ionViewDidLoad")
    }
    ionViewWillEnter(){
        console.log("ionViewWillEnter")

    }
    ionViewWillLeave(){
        console.log("ionViewWillLeave")

    }

    ionViewWillUnload(){
        console.log("ionViewWillUnload")

    }
    ionViewCanEnter(){
        console.log("ionViewCanEnter")

    }
    ionViewCanLeave(){
        console.log("ionViewCanLeave")

    }

    ionViewDidLeave(){
        console.log("DidLeave")

    }
    ionViewDidEnter() {
      console.log("ionDidEnter")
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
          }
      })
       console.log(this.catchedPokemons);
  }

    ngOnDestroy(): void {
      console.log("WOOOT")
    }
}
