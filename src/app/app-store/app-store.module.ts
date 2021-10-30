import {NgModule} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from 'src/environments/environment';
import {appReducers} from './states-config';


@NgModule({
  declarations: [],
  imports: [
    StoreModule.forRoot(
      appReducers,
      {
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true,
          strictStateSerializability: true,
          strictActionSerializability: true,
          strictActionWithinNgZone: true,
          strictActionTypeUniqueness: true,
        },
      }
    ),
    StoreDevtoolsModule.instrument({ // ngrx调试工具
      maxAge: 25,
      logOnly: environment.storeDevtools.logOnly,
      features: {
        pause: false,
        lock: true,
        persist: true
      }
    }),
  ]
})
export class AppStoreModule {
}
