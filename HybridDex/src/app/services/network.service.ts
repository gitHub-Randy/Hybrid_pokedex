import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  constructor(private network: Network) { }


  isConnected(): boolean {
    const networkState = this.network.type;
    console.log(networkState);
    if (networkState === 'none') {
      return false;
    } else {
      return true;
    }
  }
}
