import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef, Inject, Input,
  OnChanges,
  OnInit, SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import BScroll, {MouseWheel, ScrollBar} from 'better-scroll';
import {WINDOW} from '../../../services/service.module';
import {timer} from 'rxjs';
import {limitNumberInRange} from '../../../utils/number';

BScroll.use(ScrollBar);
BScroll.use(MouseWheel);

@Component({
  selector: 'app-better-scroll',
  templateUrl: './better-scroll.component.html',
  styleUrls: ['./better-scroll.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BetterScrollComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() dataList!: any[];
  @Input() visible = false;
  @Input() pageSize = 1;
  @Input() currentIndex = 0;
  @Input() currentScrollOffset?: number; // 移动前偏移量
  @Input() private refreshDelay = 50;
  @Input() private refreshUseTime = 100;
  @Input() private scrollDelay = 50;

  @ViewChild('wrapContent', {static: true}) private wrapContent!: ElementRef;
  private scrolledY = 0;
  private bs!: BScroll;
  private scrollAble = false;

  constructor(
    readonly el: ElementRef,
    @Inject(WINDOW) private win: Window,
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.bs = new BScroll(this.wrapContent.nativeElement, {
      scrollbar: {interactive: true, fade: true},
      mouseWheel: {}
    });
    this.bs.on('scrollEnd', ({y}: any) => {
      this.scrolledY = y; // 记录当前滚动值
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    /*
    * 组件中数据发生变化，则调用refresh
    * */
    if (changes.dataList && changes.dataList.currentValue) {
      if (this.visible) {
        this.refreshScroll();
      }
    } else if (changes.visible && changes.visible.currentValue) {
      if (this.dataList) {
        this.refreshScroll();
      }
    } else if (changes.currentIndex && changes.currentIndex.currentValue >= 0) {
      this.scrollToCurrent();
    }
  }

  scrollToCurrent(): void {
    if (this.visible && this.scrollAble) {
      const liElements = this.el.nativeElement.querySelectorAll('ul li');
      if (liElements.length) {
        if (this.currentScrollOffset) { // 带偏移的滚动
          let needScroll = 0;
          for (let i = 0; i < liElements.length; i++) {
            if (i < this.currentIndex) {
              needScroll += liElements[i].offsetHeight;
            }
          }
          const realNeedScrollTo = needScroll < this.currentScrollOffset ? 0 : needScroll - this.currentScrollOffset;
          this.scrollTo(0, -realNeedScrollTo); // 向下滚动 y轴为负数
        } else {
          /*
          * 假设每页放的歌曲位置固定的滚动 不用保证目标项像歌词一样滚动到固定位置
          * 即使手动拖动打乱 切歌后也可自动刷新滚动位置
          * */
          this.scrollToElement((liElements[Math.floor(this.currentIndex / this.pageSize) * this.pageSize]) as HTMLElement, this.scrollDelay, false, false);
        }
      }
    }
  }

  /*
  * 数据加载完才可以刷新
  * 需要一定延迟 给dom渲染
  * 两种延迟方案 非必要不使用dom
  * */
  refreshScroll(): void {
    this.scrollAble = false;
    this.win.setTimeout(() => {
      this.bs.refresh();
      const subscription = timer(this.refreshUseTime).subscribe(() => {
        this.scrollAble = true;
        if (this.currentIndex < 0) {
          this.scrollTo(0, 0); // 刷新默认滚回顶部
        } else {
          this.scrollToCurrent();
        }
        subscription.unsubscribe();
      });
    }, this.refreshDelay);
  }

  scrollToElement(...args: any): void {
    this.bs.scrollToElement.apply(this.bs, args);
  }

  scrollTo(...args: any): void {
    this.bs.scrollTo.apply(this.bs, args);
  }
}
