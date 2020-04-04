import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PokemonService} from "../../services/pokemon.service";
import { Storage } from '@ionic/storage';
import {NavController} from "@ionic/angular";

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
  constructor(private  route: ActivatedRoute,private pokeService: PokemonService,private storage:Storage,private navCtrl: NavController) { }

  ngOnInit() {
     this.index = this.route.snapshot.paramMap.get('id');
     console.log(this.index)
    this.catchedPokemon =  this.storage.get(`catchedPokemon${this.index}`).then((data) =>{
      this.nickName = data.NickName
      this.pokeService.getPokeDetails(data.Id).subscribe(details =>{
        this.details = details;
      })
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

  gotoPreviousPage() {
    console.log("YEEET")
    this.navCtrl.pop();
    this.navCtrl.navigateRoot("tabs/tab3", );

  }


  showItem() {
    this.navCtrl.remove(this.navCtrl.last().index)
        .then(
            () => {
              this.navCtrl.push("tabs/tab3", {
              });
            },
            error => {}
        );

  }
}
