import {Observable} from 'rxjs';


export type sliderOffsetPositionType = number | null;

export type WySliderDrag = {
  start: 'touchstart' | 'mousedown';
  move: 'touchmove' | 'mousemove';
  end: 'touchend' | 'mouseup';
  filter: (e: Event) => boolean;
  pluckKey: string[];
  dragStart$?: Observable<number>;
  dragMoing$?: Observable<number>;
  dragEnd$?: Observable<Event>;
};


export function getElementOffset(el: HTMLElement): { top: number, left: number } {
  const badRes = {
    top: 0,
    left: 0
  };

  if (!el.getClientRects().length) {
    return badRes;
  }

  const rect = el.getBoundingClientRect();
  const defaultView = el.ownerDocument.defaultView;

  if (defaultView) {
    return {
      top: rect.top + defaultView.pageYOffset,
      left: rect.left + defaultView.pageXOffset
    };
  } else {
    return badRes;
  }
}

