import {NgModule} from '@angular/core';
import {FormatPlayCountPipe} from './format/format-play-count.pipe';
import { FormatTimePipe } from './format/format-time.pipe';
import {HighlightByRegPipe} from './highlight/highlight-by-Reg.pipe';


@NgModule({
  declarations: [
    HighlightByRegPipe,
    FormatPlayCountPipe,
    FormatTimePipe
  ],
  imports: [],
  exports: [
    HighlightByRegPipe,
    FormatPlayCountPipe,
    FormatTimePipe
  ]
})
export class PipesModule {
}
