import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

declare var admob;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // admob.setDevMode(false);
      admob.banner.show({
        id: {
          android: 'ca-app-pub-5311874154265090/7330573450',
          // android: 'ca-app-pub-5311874154265090/4280009918',
          // ios: 'test',
        },
      });
      document.addEventListener('admob.banner.load', (e) => {
        console.log(`Successfully showing ads...`, e);
      });

      document.addEventListener('admob.banner.load_fail', (e) => {
        console.error(`Error showing ads...`, e);
      });
    });
  }
}
