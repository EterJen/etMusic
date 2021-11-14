import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SingerDetailResolver, singerDetailResolver} from './singer-detail/singer-detail.resolver';
import {SingerDetailComponent} from './singer-detail/singer-detail.component';

const routes: Routes = [
  {
    path: 'singer',
    children: [
      {
        path: 'detail/:id',
        component: SingerDetailComponent,
        data: {title: '歌手详情'},
        resolve: singerDetailResolver
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [SingerDetailResolver]
})
export class SignerRoutingModule { }
