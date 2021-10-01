import {ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {fromEvent, Observable} from 'rxjs';
import {distinctUntilChanged, filter, merge, pluck, takeUntil} from 'rxjs/operators';
import {map, tap} from 'rxjs/internal/operators';
import {WySliderDrag} from '../../../data-types/types/wy-slider';
import {DOCUMENT} from '@angular/common';
import {getElementOffset, prohibitBubbling} from './wy-slider.helper';
import {inArray} from '../../../utils/array';
import {limitNumberInRange} from '../../../utils/number';

@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WySliderComponent implements OnInit {
  @Input() isVertical = false;
  @Input() minWidth = 0;
  @Input() maxWidth = 100;

  private sliderDom!: HTMLDivElement;
  @ViewChild('wySlider', {static: true}) private wySlider!: ElementRef;

  private dragStart$!: Observable<number>;
  private dragging$!: Observable<number>;
  private dragEnd$!: Observable<Event>;
  private isDragMoving = false;

  constructor(
    /*
    * 原生dom不利于渲染，注入angular优化dom
    * */
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  ngOnInit(): void {
    this.sliderDom = this.wySlider.nativeElement;
    this.createDraggingObservables();
    this.subscribeDrag(['start']);
  }

  private createDraggingObservables(): void {
    const orientField = this.isVertical ? 'pageY' : 'pageX';
    const pmdSliderDrag: WySliderDrag = {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
      filter: (e: Event) => e instanceof TouchEvent,
      pluckKey: ['touches', '0', orientField]
    };
    const pcSliderDrag: WySliderDrag = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup',
      filter: (e: Event) => e instanceof MouseEvent,
      pluckKey: [orientField]
    };
    const wySliderDrags: WySliderDrag[] = [pcSliderDrag, pmdSliderDrag];

    /*
    * 不使用foreach 防止异步问题
    * */
    for (const drag of wySliderDrags) {
      drag.dragStart$ = fromEvent(this.sliderDom, drag.start).pipe(
        filter(drag.filter),
        tap(prohibitBubbling),
        pluck<Event, number>(...drag.pluckKey),
        map((position: number) => {
          return this.findClosedValue(position);
        })
      );
      drag.dragEnd$ = fromEvent(this.document, drag.end);
      drag.dragging$ = fromEvent(this.sliderDom, drag.move).pipe(
        filter(drag.filter),
        tap(prohibitBubbling),
        pluck<Event, number>(...drag.pluckKey),
        distinctUntilChanged(),
        map((position: number) => {
          return this.findClosedValue(position);
        }),
        takeUntil(drag.dragEnd$)
      );

      if (this.dragStart$) {
        this.dragStart$.pipe(
          merge(drag.dragStart$)
        );
      } else {
        this.dragStart$ = drag.dragStart$;
      }
      if (this.dragging$) {
        this.dragging$.pipe(
          merge(drag.dragging$)
        );
      } else {
        this.dragging$ = drag.dragging$;
      }
      if (this.dragEnd$) {
        this.dragEnd$.pipe(
          merge(drag.dragEnd$)
        );
      } else {
        this.dragEnd$ = drag.dragEnd$;
      }

    }

  }

  /*
  * position 是值带有滚动的定位 参考系为：el.getClientRects()
  * */
  private findClosedValue(position: number): number {
    /*滑块总长*/
    const sliderLength = this.getSliderLength();

    /*滑块相对页面偏移量*/
    const sliderStart = this.getSliderStart();
    const ratio = limitNumberInRange((position - sliderStart) / sliderLength, 0, 1);
    const realRatio = this.isVertical ? 1 - ratio : ratio;
    return realRatio * (this.maxWidth - this.minWidth) + this.minWidth;
  }

  private getSliderLength(): number {
    return this.isVertical ? this.sliderDom.clientHeight : this.sliderDom.clientWidth;
  }

  private getSliderStart(): number {
    const offset = getElementOffset(this.sliderDom);
    return this.isVertical ? offset.top : offset.left;
  }

  private subscribeDrag(events: string[] = ['start', 'move', 'end']): void {
    if (inArray(events, 'start') && this.dragStart$) {
      this.dragStart$.subscribe(this.onDragStart.bind(this));
    }
    if (inArray(events, 'move') && this.dragging$) {
      this.dragging$.subscribe(this.onDragging.bind(this));
    }
    if (inArray(events, 'end') && this.dragEnd$) {
      this.dragEnd$.subscribe(this.onDragEnd.bind(this));
    }
  }

  /*开始拖动*/
  private onDragStart(value: number): void {
    console.log(value);
    this.toggleDragMoving(true);
  }

  /*切换滑动*/
  private toggleDragMoving(movable: boolean): void {
    this.isDragMoving = movable;
    if (movable) {
      this.subscribeDrag(['s']);
    }

  }

  /*拖动中*/
  private onDragging(value: number): void {

  }

  /*拖动结束*/
  private onDragEnd(): void {
  }
}
