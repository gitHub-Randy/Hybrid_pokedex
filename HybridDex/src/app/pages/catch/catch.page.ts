import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-catch',
  templateUrl: './catch.page.html',
  styleUrls: ['./catch.page.scss'],
})
export class CatchPage implements OnInit {
  pokemon: any;
  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.pokemon = params.pokemon;
      console.log(params.pokemon.Pokemon)
      console.log(this.pokemon)

    });
  }

  ngOnInit() {
  }

}
