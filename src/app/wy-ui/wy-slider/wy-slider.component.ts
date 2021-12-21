import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter, forwardRef,
  Inject,
  Input, OnChanges, OnDestroy,
  OnInit, Output, SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {fromEvent, Observable, of, Subscription} from 'rxjs';
import {distinctUntilChanged, filter, merge, pluck, takeUntil} from 'rxjs/operators';
import {map, tap} from 'rxjs/internal/operators';
import {DOCUMENT} from '@angular/common';
import {getElementOffset, sliderOffsetPositionType, WySliderDrag} from './wy-slider.helper';
import {ArrayUtils} from '../../utils/ArrayUtils';
import {wyySliderDragEvent} from '../../data-types/consts/wyy.consts';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {EventUtils} from '../../utils/EventUtils';
import {NumberUtils} from '../../utils/NumberUtils';

@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  /*
  * ViewEncapsulation.Emulated 按一定规则得到新的定义样式 只在自己组件有效，不会被子组件（即使为None）同名样式覆盖也不会下沉子组件。 默认值
  * wy-slider-handle.component.less 虽然没指定 但其中样式被替换为新的定义：
  * .wy-slider-handle[_ngcontent-hmt-c103] {
  * cursor: not-allowed;
  * }
  * 增加了_ngcontent-ykd-c103 同时_ngcontent-ykd-c103是.wy-slider-handle 所在div的一个属性 导致这一样式只对该目标div生效 不会覆盖 不会继承
  *
  * ViewEncapsulation.None  保留原样式定义 组件的样式会受外界影响，可以影响子组件；也可能被子组件同名样式覆盖掉(当子组件也为None)。
  * wy-slider.component.less 中样式则没有改变(保持原样) 可以在 wy-slider-handle.component.less 中生效（被继承）  或被覆盖
  * */
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  /*注入token*/
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WySliderComponent),
      multi: true // 多实例注入
    }
  ]
})
export class WySliderComponent implements OnInit, OnDestroy, ControlValueAccessor, OnChanges {
  @Input() public sliderIsVertical = false;
  @Input() public dragAble = false;
  @Input() public minWidth = 0;
  @Input() public maxWidth = 100;
  @Input() public sliderBufferOffset = 0;
  /*
  * sliderOffset相当于value
  * */
  @Output() sliderDragEnd = new EventEmitter<number>();
  @Output() sliderDragStart = new EventEmitter<null>();
  public sliderOffset = 0;
  @ViewChild('wySlider', {static: true}) private wySlider!: ElementRef;
  private sliderDom!: HTMLDivElement;
  private dragStart$!: Observable<number>;
  private dragMoving$!: Observable<number>;
  private dragEnd$!: Observable<Event>;
  private dragStartSs!: Subscription | null;
  private dragMovingSs!: Subscription | null;
  private dragEndSs!: Subscription | null;
  private isDragMoving = false;
  /*
  * 记录相对位置，不同于sliderOffset合乎规则，需要经过计算得到sliderOffset
  * */
  private sliderOffsetPosition: sliderOffsetPositionType = null;

  constructor(
    /*
    * 原生dom不利于渲染，注入angular优化dom
    * */
    @Inject(DOCUMENT) private document: Document,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.sliderDom = this.wySlider.nativeElement;
    this.createDraggingObservables();
    /*拖动订阅打开 pc短监听鼠标按下事件*/
    this.subscribeDrag(['start']);
  }


  /*
  * 实现组件的ng-module功能
  * fn：父组件[(ngModel)]值改变的回调函数
  * 注册父组件传来的onChange事件,将匿名事件绑定到本组件
  * 当调用子组件目标绑定方法，将触发fn，并将入参作为value刷新父组件
  * 相当于子传父的数据传递，只是不需要在父组件中重写更新value的接收代码（估计接口已帮忙实现），子组件只管发送，父组件自动刷新value
  * */
  registerOnChange(fn: any): void {
    this.onSliderOffsetPositionChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /*
  * 接受string 方便json数据传输
  * 传入：sliderOffsetPosition
  * 修改并监听：sliderOffset (同表单中的value)
  * */
  writeValue(sliderOffsetPosition: string | number): void {
    this.setOffsetPositionWithCheck(sliderOffsetPosition);
  }

  ngOnDestroy(): void {
    /*销毁取消订阅 释放资源*/
    this.unSubscribeDrag(['start', 'moving', 'end']);
  }

  ngOnChanges(changes: SimpleChanges): void {
    /*
    * 渲染策略为：ChangeDetectionStrategy.OnPush
    * 数据变化 并不会刷新dom
    * 这里需要手动触发dom更新
    * */
    this.cdr.markForCheck();
  }

  private onSliderOffsetPositionChange(sliderOffset: number): void {
  }

  private onTouched(): void {

  }

  private createDraggingObservables(): void {
    const orientField = this.sliderIsVertical ? 'pageY' : 'pageX';
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
        tap(EventUtils.prohibitEventBubbling),
        pluck<Event, number>(...drag.pluckKey),
        map((rawPosition: number) => {
          return this.calcOffsetPosition(rawPosition);
        })
      );
      drag.dragEnd$ = fromEvent(this.document, drag.end);
      drag.dragMoing$ = fromEvent(this.sliderDom, drag.move).pipe(
        filter(drag.filter),
        tap(EventUtils.prohibitEventBubbling),
        pluck<Event, number>(...drag.pluckKey),
        distinctUntilChanged(),
        map((rawPosition: number) => {
          return this.calcOffsetPosition(rawPosition);
        }),
        takeUntil(drag.dragEnd$)/*保证dragMoing$总在dragEnd$ 前被订阅到值*/
      );

      if (this.dragStart$) {
        this.dragStart$.pipe(
          merge(drag.dragStart$)
        );
      } else {
        this.dragStart$ = drag.dragStart$;
      }
      if (this.dragMoving$) {
        this.dragMoving$.pipe(
          merge(drag.dragMoing$)
        );
      } else {
        this.dragMoving$ = drag.dragMoing$;
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
  * 计算相对偏移位置
  * rawPosition 是值带有滚动的定位 参考系为：el.getClientRects()
  * 返回offsetPosition 相对滑块起点的偏移位置
  * */
  private calcOffsetPosition(rawPosition: number): number {
    /*滑块总长*/
    const sliderLength = this.getSliderLength();

    /*滑块相对页面偏移量*/
    const sliderStart = this.getSliderStart();
    const ratio = NumberUtils.limitNumberInRange((rawPosition - sliderStart) / sliderLength, 0, 1);
    const realRatio = this.sliderIsVertical ? 1 - ratio : ratio;
    return realRatio * (this.maxWidth - this.minWidth) + this.minWidth;
  }

  private getSliderLength(): number {
    return this.sliderIsVertical ? this.sliderDom.clientHeight : this.sliderDom.clientWidth;
  }

  private getSliderStart(): number {
    const offset = getElementOffset(this.sliderDom);
    return this.sliderIsVertical ? offset.top : offset.left;
  }

  private wyySliderDragEventContain(events: wyySliderDragEvent[], event: wyySliderDragEvent): boolean {
    return ArrayUtils.inArray(events, event);
  }

  /*订阅*/
  private subscribeDrag(events: wyySliderDragEvent[]): void {
    if (this.wyySliderDragEventContain(events, 'start') && this.dragStart$ && !this.dragStartSs) {
      /*拖动开始订阅 鼠标按键按下触发*/
      this.dragStartSs = this.dragStart$.subscribe(this.onDragStart.bind(this));
    }
    if (this.wyySliderDragEventContain(events, 'moving') && this.dragMoving$ && !this.dragMovingSs) {
      /*拖动中订阅 鼠标拖动中触发*/
      this.dragMovingSs = this.dragMoving$.subscribe(this.onDragMoving.bind(this));
    }
    if (this.wyySliderDragEventContain(events, 'end') && this.dragEnd$ && !this.dragEndSs) {
      /*拖动结束订阅 鼠标按键松开触发*/
      this.dragEndSs = this.dragEnd$.subscribe(this.onDragEnd.bind(this));
    }
  }

  /*取消订阅*/
  private unSubscribeDrag(events: wyySliderDragEvent[]): void {
    if (this.wyySliderDragEventContain(events, 'start') && this.dragStartSs) {
      this.dragStartSs.unsubscribe();
      this.dragStartSs = null;
    }
    if (this.wyySliderDragEventContain(events, 'moving') && this.dragMovingSs) {
      this.dragMovingSs.unsubscribe();
      this.dragMovingSs = null;
    }
    if (this.wyySliderDragEventContain(events, 'end') && this.dragEndSs) {
      this.dragEndSs.unsubscribe();
      this.dragEndSs = null;
    }
  }

  /*开始拖动*/
  private onDragStart(offsetPosition: number): void {
    if (!this.dragAble) {
      return;
    }
    this.sliderDragStart.emit(); // 告知父组件开始拖动
    this.toggleDragMoving(true);

    this.setOffsetPosition(offsetPosition);
    this.onSliderOffsetPositionChange(this.sliderOffset);
  }

  /*切换滑动*/
  private toggleDragMoving(movable: boolean): void {
    this.isDragMoving = movable;
    if (movable) {
      /*监听滑动*/
      this.subscribeDrag(['moving', 'end']);
    } else {
      /*滑动结束 取消两个订阅 提高性能*/
      this.unSubscribeDrag(['moving', 'end']);

    }

  }

  /*拖动中*/
  private onDragMoving(offsetPosition: number): void {
    if (this.isDragMoving) {
      this.setOffsetPosition(offsetPosition);
      /*
     * 调用被注册的方法 触发registerOnChange 刷新父dom
     * 如果需要做到拖动过程中不要触发父组件刷新 则放到onDragEnd方法中
     * 此处需要及时返回百分比给父组件 一边拖动一边显示可至播放时间 提高用户使用体验
     * */
      this.onSliderOffsetPositionChange(this.sliderOffset);
    }
  }

  private setOffsetPositionWithCheck(offsetPosition: string | number): void {
    if (this.isDragMoving) {
      return;
    }

    this.setOffsetPosition(this.formatSliderOffsetPosition(offsetPosition));

  }

  private formatSliderOffsetPosition(offsetPosition: string | number): sliderOffsetPositionType {
    let result: number;
    if (typeof offsetPosition === 'string') {
      result = parseFloat(offsetPosition);
    } else {
      result = offsetPosition;
    }
    if (isNaN(result)) {
      result = this.minWidth;
    }
    return NumberUtils.limitNumberInRange(result, this.minWidth, this.maxWidth);
  }

  private setOffsetPosition(sliderOffsetPosition: sliderOffsetPositionType): void {
    if (this.sliderOffset !== sliderOffsetPosition) {
      this.sliderOffsetPosition = sliderOffsetPosition;
      this.updateTrackAndHandles();
    }
  }

  /*拖动结束*/
  private onDragEnd(): void {
    this.sliderDragEnd.emit(this.sliderOffset); // 完成拖动 通知父组件
    this.toggleDragMoving(false);
  }

  /*更新进度条滑块长度，触点位置*/
  private updateTrackAndHandles(): void {
    this.sliderOffset = this.calcOffset();
    this.cdr.markForCheck();
  }

  private calcOffset(): number {
    return NumberUtils.calcPresent(this.sliderOffsetPosition, this.minWidth, this.maxWidth);
  }
}
