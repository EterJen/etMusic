import {Directive, ElementRef, EventEmitter, Inject, Input, OnChanges, Output, Renderer2, SimpleChanges} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Directive({
  selector: '[appClickOutSide]'
})
export class ClickOutSideDirective implements OnChanges {

  @Output() clickOutSide = new EventEmitter<void>();
  @Input() clickOutSideListenAble = false;
  private handleClick?: () => void;

  constructor(
    private elementRef: ElementRef,
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.clickOutSideListenAble) {
      if (changes.clickOutSideListenAble.currentValue && !this.handleClick) {
        this.handleClick = this.renderer2.listen(this.document, 'click', event => {
          /*
          * 被删除的元素不会被包含 可以将event.target 发射出去 再根据业务比较一个特定属性
          * 也可以直接在被删除元素地方阻止冒泡 不会触发document click事件
          * */
          const isContain = this.elementRef.nativeElement.contains(event.target);
          // console.log('isContain', isContain);
          if (!isContain) {
            this.clickOutSide.emit();
          }
        });
      } else {
        if (this.handleClick) {
          this.handleClick();
          this.handleClick = undefined;
        }
      }
    }
  }

}
