import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Camera} from "@ionic-native/camera/ngx";

@Component({
  selector: 'app-catched-detail',
  templateUrl: './catched-detail.page.html',
  styleUrls: ['./catched-detail.page.scss'],
})
export class CatchedDetailPage implements OnInit {
  pokemon: any;
  currentImage: any;
  constructor(private route: ActivatedRoute, private camera: Camera) {
    this.route.queryParams.subscribe(params => {
      this.pokemon = params.pokemon;
      console.log(params.pokemon.Pokemon);
      console.log(this.pokemon);

    });
  }

  ngOnInit() {
  }

}
