import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild, ViewContainerRef
} from '@angular/core';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, pluck} from 'rxjs/operators';
import {SearchSuggestResult} from '../../data-types/results/SearchSuggest';
import {ObjUtils} from '../../utils/ObjUtils';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {WySearchPanelComponent} from './wy-search-panle/wy-search-panel.component';


@Component({
  selector: 'app-wy-search',
  templateUrl: './wy-search.component.html',
  styleUrls: ['./wy-search.component.less']
})
export class WySearchComponent implements OnInit, AfterViewInit, OnChanges {
  /*
  * 预定义属性值 供外部模板使用
  * */
  myContext = {defaultSearchTip: '歌手 / 歌曲 / 歌单'};
  @Input() customView?: TemplateRef<any>;
  @Input() searchSuggestResult!: SearchSuggestResult;
  @Output() keywordsChange = new EventEmitter<string>();
  @ViewChild('searchInput', {static: false}) private searchInput!: ElementRef;
  @ViewChild('searchOutDiv', {static: false}) private searchOutDiv!: ElementRef;
  private overlayRef?: OverlayRef;
  private keywords = '';

  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(
        debounceTime(500), // 防抖
        distinctUntilChanged(), // 直到改变 连续两次相同不广播
        pluck('target', 'value')
      )
      .subscribe((x) => {
        this.keywordsChange.emit(x as string);
        this.keywords = x as string;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.searchSuggestResult && !changes.searchSuggestResult.firstChange) {
      const change = changes.searchSuggestResult.currentValue;
      if (!ObjUtils.isEmptyObject(change)) {
        this.showOverlayPanel();
      } else {
        this.hideOverlayPanel();
      }
    }
  }

  focus(): void {
    if (this.searchSuggestResult && ObjUtils.isNotEmptyObject(this.searchSuggestResult)) {
      this.showOverlayPanel();
    }
  }

  private showOverlayPanel(): void {
    this.hideOverlayPanel();
    const flexibleConnectedPositionStrategy = this.overlay.position().flexibleConnectedTo(this.searchOutDiv).withPositions([{
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top'
    }]).withLockedPosition(true);
    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy: flexibleConnectedPositionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      width: '300px',
    });
    /*
    * 通用视点
    * */
    const componentPortal = new ComponentPortal(WySearchPanelComponent, this.viewContainerRef);
    /*
    * 附加一个视点 到 浮层
    * */
    const wySearchPanelRef = this.overlayRef.attach(componentPortal);
    wySearchPanelRef.instance.searchSuggestResult = this.searchSuggestResult;
    wySearchPanelRef.instance.keywordsReg = new RegExp(this.keywords, 'ig');
    wySearchPanelRef.instance.closeSearchPanel.subscribe((res) => {
      this.hideOverlayPanel();
    });
    this.overlayRef.backdropClick().subscribe((res) => {
      this.hideOverlayPanel();
    });
  }

  private hideOverlayPanel(): void {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.dispose();
    }
  }
}
