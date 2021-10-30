import {NgModule} from '@angular/core';
import {PlayCountPipe} from './play-count.pipe';
import { FormatTimePipe } from './format-time.pipe';


@NgModule({
  declarations: [
    PlayCountPipe,
    FormatTimePipe
  ],
  imports: [],
  exports: [
    PlayCountPipe,
    FormatTimePipe
  ]
})
export class PipesModule {
}
