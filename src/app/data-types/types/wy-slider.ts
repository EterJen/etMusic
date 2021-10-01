import {Observable} from 'rxjs';

export type WySliderDrag = {
  start: 'touchstart' | 'mousedown';
  move: 'touchmove' | 'mousemove';
  end: 'touchend' | 'mouseup';
  filter: (e: Event) => boolean;
  pluckKey: string[];
  dragStart$?: Observable<number>;
  dragging$?: Observable<number>;
  dragEnd$?: Observable<Event>;
};
