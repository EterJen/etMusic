import {NgModule} from '@angular/core';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NzCarouselModule} from 'ng-zorro-antd/carousel';


@NgModule({
  declarations: [],
  imports: [
    NzInputModule,
    NzIconModule,
    NzCarouselModule,
    NzButtonModule,
    NzMenuModule,
    NzLayoutModule
  ],
  exports: [
    NzButtonModule,
    NzInputModule,
    NzIconModule,
    NzCarouselModule,
    NzMenuModule,
    NzLayoutModule
  ]
})
export class ZorroAntdModule {
}
