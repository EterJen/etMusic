import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SongInfoComponent} from './song-info/song-info.component';
import {SongInfoResolver, songInfoResolver} from './song-info/song-info.resolver';

const routes: Routes = [
  {
    path: 'song',
    children: [
      {
        path: 'info/:id',
        component: SongInfoComponent,
        data: {title: '歌曲详情'},
        resolve: songInfoResolver
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [SongInfoResolver]
})
export class SongRoutingModule {
}
