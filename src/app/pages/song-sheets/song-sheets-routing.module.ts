import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SongSheetsComponent} from './song-sheets/song-sheets.component';

const routes: Routes = [
  {
    path: 'song-sheet',
    component: SongSheetsComponent,
    data: {title: '歌单列表'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SongSheetsRoutingModule {
}
