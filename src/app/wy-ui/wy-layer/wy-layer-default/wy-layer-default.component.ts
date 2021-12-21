import {Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter} from '@angular/core';
import {ModalType} from '../../../app-store/wy-layer-store/reducer';
import {WyLayerStoreService} from '../../../app-store/wy-layer-store/wy-Layer-store.service';

@Component({
  selector: 'app-wy-layer-default',
  templateUrl: './wy-layer-default.component.html',
  styleUrls: ['./wy-layer-default.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerDefaultComponent implements OnInit {
  ModalType = ModalType;

  constructor(
    private wyLayerStoreService: WyLayerStoreService
  ) {
  }

  ngOnInit(): void {
  }

  openLayerModal(modalType: ModalType): void {
    this.wyLayerStoreService.wyLayerModalDispatch(true, modalType);
  }
}
