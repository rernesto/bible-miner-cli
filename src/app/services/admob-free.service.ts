import { Injectable } from '@angular/core';
import {
  AdMobFree,
  AdMobFreeBannerConfig,
  AdMobFreeInterstitialConfig,
  AdMobFreeRewardVideoConfig
} from '@ionic-native/admob-free/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AdmobFreeService {

  constructor(
    private admobFree: AdMobFree,
    public platform: Platform
  ) { }

  BannerAd() {
    let bannerConfig: AdMobFreeBannerConfig;
    bannerConfig = {
      // isTesting: true, // Remove in production
      autoShow: true,
      bannerAtTop: false,
      // id: 'ca-app-pub-5311874154265090/3664142254'
      // id: 'ca-app-pub-3940256099942544/6300978111' // Dev Test
      // id: 'ca-app-pub-5311874154265090/7330573450', // Banner 1
      id: 'ca-app-pub-5311874154265090/4280009918'
    };
    this.admobFree.banner.config(bannerConfig);

    this.admobFree.banner.prepare().then(() => {
      // success
      console.log('Showing Google Ads...');
    }).catch(e => console.log(e));
  }

}
