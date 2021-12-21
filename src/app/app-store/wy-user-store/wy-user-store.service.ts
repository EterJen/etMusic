import {Injectable} from '@angular/core';
import {AppStoreModule} from '../app-store.module';
import {select, Store} from '@ngrx/store';
import {AppStore} from '../states-config';

import {Observable} from 'rxjs';
import {FlexWyUserState, WyUserState} from './reducer';
import {getWyUserCellphoneLoginParams, getWyUserLoginInfo, getWyUserState} from './selector';
import LoginInfo from '../../data-types/results/LoginInfo';
import {flexSetUserState} from './action';
import {CellphoneLoginParams} from '../../services/bz/member.service';

@Injectable({
  providedIn: AppStoreModule
})
export class WyUserStoreService {

  private wyLayerStore: Observable<any>;
  private state!: WyUserState;

  constructor(
    private appStore: Store<AppStore>
  ) {
    this.wyLayerStore = this.appStore.pipe(select('wyUser'));
    this.watchWyLayerState().subscribe((state: WyUserState) => {
      this.state = state;
    });
  }

  public watchWyLayerState(): Observable<WyUserState> {
    return this.wyLayerStore.pipe(select(getWyUserState));
  }

  public watchWyUserLoginInfo(): Observable<LoginInfo | null> {
    return this.wyLayerStore.pipe(select(getWyUserLoginInfo));
  }
  public watchWyUserCellphoneLoginParams(): Observable<CellphoneLoginParams | null> {
    return this.wyLayerStore.pipe(select(getWyUserCellphoneLoginParams));
  }
  flexSet(flexWyUserState: FlexWyUserState): void {
    this.appStore.dispatch(flexSetUserState(flexWyUserState));
  }
}
