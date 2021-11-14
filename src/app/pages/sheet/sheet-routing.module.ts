import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SheetListComponent} from './sheet-list/sheet-list.component';
import {SheetInfoComponent} from './sheet-info/sheet-info.component';
import {sheetInfoResolver, SheetInfoResolver} from './sheet-info/sheet-info.resolver';

const routes: Routes = [
  {
    path: 'sheet',
    children: [
      {
        path: 'list',
        component: SheetListComponent,
        data: {title: '歌单列表'}
      },
      {
        path: 'info/:id',
        component: SheetInfoComponent,
        data: {title: '歌单详情'},
        resolve: sheetInfoResolver
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [SheetInfoResolver]
})
export class SheetRoutingModule {
}
