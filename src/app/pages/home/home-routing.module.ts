import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home.component';
import {HomeResolverData, HomeResolver} from './home.resolver';

export type HomeRoutData = {
  name?: string,
  resolverData?: HomeResolverData
};

const routeData: HomeRoutData = {
  name: '小明'
};


const routes: Routes = [
  {path: 'home', component: HomeComponent, data: routeData, resolve: {resolverData: HomeResolver}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [HomeResolver]
})
export class HomeRoutingModule {
}
