import {Injectable} from '@angular/core';
import {AppStoreModule} from '../app-store.module';
import {select, Store} from '@ngrx/store';
import {AppStore} from '../states-config';

import {Observable} from 'rxjs';
import {ModalType, WyLayerState} from './reducer';
import {getWyLayerModalType, getWyLayerState, getWyLayerVisible} from './selector';
import {flexSetLayerState} from './action';

@Injectable({
  providedIn: AppStoreModule
})
export class WyLayerStoreService {

  private wyLayerStore: Observable<any>;
  private wyLayerState!: WyLayerState;

  constructor(
    private appStore: Store<AppStore>
  ) {
    this.wyLayerStore = this.appStore.pipe(select('wyLayer'));
    this.watchWyLayerState().subscribe((wyLayerState: WyLayerState) => {
      this.wyLayerState = wyLayerState;
    });
  }

  public watchWyLayerState(): Observable<WyLayerState> {
    return this.wyLayerStore.pipe(select(getWyLayerState));
  }

  public watchWyLayerVisible(): Observable<boolean> {
    return this.wyLayerStore.pipe(select(getWyLayerVisible));
  }

  public watchWyLayerModalType(): Observable<ModalType> {
    return this.wyLayerStore.pipe(select(getWyLayerModalType));
  }

  /*
  * 弹窗控制
  * */
  wyLayerModalDispatch(visible = true, modalType = ModalType.Default): void {
    this.appStore.dispatch(flexSetLayerState({visible, modalType}));
  }
}
