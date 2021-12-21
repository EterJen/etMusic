import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ElementRef,
  ChangeDetectorRef,
  ViewChild,
  AfterViewInit,
  Renderer2, Inject, OnChanges, SimpleChanges
} from '@angular/core';
import {WyLayerStoreService} from '../../../app-store/wy-layer-store/wy-Layer-store.service';
import {ModalType} from '../../../app-store/wy-layer-store/reducer';
import {Overlay, OverlayRef, OverlayKeyboardDispatcher, BlockScrollStrategy, OverlayContainer} from '@angular/cdk/overlay';
import {DOCUMENT} from '@angular/common';
import {DomOpService} from '../../../services/common/dom-op.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {timer} from 'rxjs';

@Component({
  selector: 'app-wy-layer-modal',
  templateUrl: './wy-layer-modal.component.html',
  styleUrls: ['./wy-layer-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('modalShowHideAMI', [
      state('show', style({transform: 'scale(1)', opacity: 1})),
      state('hide', style({transform: 'scale(0)', opacity: 0})),
      transition('show<=>hide', animate('0.1s'))
    ])
  ],
})
export class WyLayerModalComponent implements OnInit, AfterViewInit {
  showModal: 'hide' | 'show' = 'hide';
  ModalType = ModalType;
  modalType: ModalType = ModalType.Default;
  private visible = false;
  private overlayRef!: OverlayRef;
  private blockScrollStrategy: BlockScrollStrategy;
  @ViewChild('modalContainer', {static: false}) private modalRef!: ElementRef<HTMLElement>;
  private resizeHandler?: () => void;
  private containerElement!: HTMLElement;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private wyLayerStoreService: WyLayerStoreService,
    private overlay: Overlay,
    private elementRef: ElementRef,
    private overlayKeyboardDispatcher: OverlayKeyboardDispatcher,
    private changeDetectorRef: ChangeDetectorRef,
    private renderer2: Renderer2,
    private domOpService: DomOpService,
    private overlayContainer: OverlayContainer,
  ) {
    this.blockScrollStrategy = this.overlay.scrollStrategies.block();
    this.wyLayerStoreService.watchWyLayerState().subscribe((res) => {
      if (this.modalType !== res.modalType) {
        this.modalType = res.modalType;
        if (this.visible !== res.visible) {
          this.visible = res.visible;
          this.handleVisibleChange(res.visible);
        }
        this.modalListenToCenter();
      } else if (this.visible !== res.visible) { // 模态框没改变的情况 直接刷新显示 否则等计算完新的模态框位置后 再显示
        this.visible = res.visible;
        this.handleVisibleChange(res.visible);
        this.modalListenToCenter();
      }
    });
  }


  ngOnInit(): void {
    this.createOverlay();
  }

  hide(): void {
    this.wyLayerStoreService.wyLayerModalDispatch(false, this.modalType);
  }

  ngAfterViewInit(): void {
    this.containerElement = this.overlayContainer.getContainerElement();
    this.modalListenToCenter();
  }

  modalListenToCenter(): void {
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
    timer().subscribe(() => {
      this.keepModalCenter();
      this.flushVisible();
    });
  }

  private createOverlay(): void {
    this.overlayRef = this.overlay.create();
    /**
     * appendChild 会改变dom结构 加断点就会发现 被添加元素前后domTree挂载位置变化
     * overlay始终处于顶层，与app-root同级 原来挂在app-root中的dom节点会被重新挂载到 .cdk-overlay-container dom下
     * 可以同时挂载多个
     */
    this.overlayRef.overlayElement.appendChild(this.elementRef.nativeElement);
    this.overlayRef.keydownEvents().subscribe((res) => {
      this.keydownListener(res);
    });
  }

  private keydownListener(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.hide();
    }
  }

  private handleVisibleChange(visible: boolean): void {
    if (visible) {
      this.blockScrollStrategy.enable();
      this.overlayKeyboardDispatcher.add(this.overlayRef);
      this.setContainerPointEvents('auto');
    } else {
      this.blockScrollStrategy.disable();
      this.overlayKeyboardDispatcher.remove(this.overlayRef);
      this.setContainerPointEvents('none');
    }
  }

  private keepModalCenter(): void {
    const modal = this.modalRef.nativeElement;
    const hideDomSize = this.domOpService.getHideDomSize(modal);
    const windowSize = this.domOpService.getWindowSize();
    const left = (windowSize.w - hideDomSize.w) / 2;
    const top = (windowSize.h - hideDomSize.h) / 2;
    // const top = (windowSize.h - hideDomSize.h) / 2 - (hideDomSize.h / 2) + 20;
    modal.style.left = left + 'px';
    modal.style.top = top + 'px';
  }

  /**
   * container z-index为1000
   * pointEvents 为auto 开启点击事件 点击被container捕获 并且不会向下层app-root 传递
   * 为 none 关闭点击事件 事件跨过container 传递到 内层 app-root
   * @param type
   * @private
   */
  private setContainerPointEvents(type: 'none' | 'auto'): void {
    this.containerElement.style.pointerEvents = type;
  }

  /**
   * 弹出层显示隐藏逻辑独立出来
   * 因为通常需要等根据模态框大小 调整居中位置 再显示
   * @private
   */
  private flushVisible(): void {
    if (this.visible) {
      this.showModal = 'show';
      if (!this.resizeHandler) {
        this.resizeHandler = this.renderer2.listen('window', 'resize', () => {
          this.keepModalCenter();
        });
      }
    } else {
      this.showModal = 'hide';
      if (this.resizeHandler) {
        this.resizeHandler();
        this.resizeHandler = undefined;
      }
    }
    this.changeDetectorRef.markForCheck(); // 可检测开启
    this.changeDetectorRef.detectChanges(); // 更新视图
  }
}
