import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {getPlayList } from '../../../app-store/player-store/selector';
import {AppStore} from '../../../app-store/states-config';

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit {

  public wyySliderOffset = 35;
  public wyySliderBufferOffset = 55;

  constructor(private appStore: Store<AppStore>) {
    this.appStore.pipe(select('player'), select(getPlayList)).subscribe(list => {
      console.log(list);
    });
  }

  ngOnInit(): void {
  }

}
