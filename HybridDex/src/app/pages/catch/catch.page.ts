import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-catch',
  templateUrl: './catch.page.html',
  styleUrls: ['./catch.page.scss'],
})
export class CatchPage implements OnInit {
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

  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      this.currentImage = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
      console.log('Camera issue:' + err);
    });
  }

}
