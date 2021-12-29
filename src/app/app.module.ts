import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {commonHttpInterceptorProvides} from './services/http-config/http-interceptor.provides';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    CoreModule,
  ],
  providers: [commonHttpInterceptorProvides],
  bootstrap: [AppComponent]
})
export class AppModule {
}
