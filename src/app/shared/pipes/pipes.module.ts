import {NgModule} from '@angular/core';
import {FormatPlayCountPipe} from './format/format-play-count.pipe';
import { FormatTimePipe } from './format/format-time.pipe';


@NgModule({
  declarations: [
    FormatPlayCountPipe,
    FormatTimePipe
  ],
  imports: [],
  exports: [
    FormatPlayCountPipe,
    FormatTimePipe
  ]
})
export class PipesModule {
}
