import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {nzSlideType} from '../../../../data-types/consts/nz.slider.consts';

@Component({
  selector: 'app-wy-carousel',
  templateUrl: './wy-carousel.component.html',
  styleUrls: ['./wy-carousel.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyCarouselComponent implements OnInit {
  @ViewChild('wyCarouselDot', {static: true}) wyCarouselDot!: TemplateRef<any>;
  @Input() activeIdx = 0;
  @Output() slideBtnClick = new EventEmitter<nzSlideType>();

  constructor() {
  }

  ngOnInit(): void {
  }

  onSlideBtnClick(type: nzSlideType): void {
    this.slideBtnClick.emit(type);
  }
}
