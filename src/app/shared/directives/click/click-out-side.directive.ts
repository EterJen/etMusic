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
          const isContain = this.elementRef.nativeElement.contains(event.target);
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
