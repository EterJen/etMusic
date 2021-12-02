import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {NeteaseCloudMusicApiPrefix, ServiceModule} from '../service.module';
import {Observable} from 'rxjs';
import {map} from 'rxjs/internal/operators';
import {NzModalService} from 'ng-zorro-antd/modal';
import SearchSuggest, {SearchSuggestResult} from '../../data-types/results/SearchSuggest';
import {pluck} from 'rxjs/operators';
import {Router} from '@angular/router';


@Injectable({
  providedIn: ServiceModule
})
export class RouterService {

  constructor(
    private router: Router,
  ) {
  }

  commonNavigate(): void {
  }
}
