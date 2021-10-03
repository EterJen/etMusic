import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {nzCarouselMoveType} from '../../../../data-types/consts/nz.consts';

@Component({
  selector: 'app-wy-carousel',
  templateUrl: './wy-carousel.component.html',
  styleUrls: ['./wy-carousel.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyCarouselComponent implements OnInit {
  @ViewChild('wyCarouselDot', {static: true}) wyCarouselDot!: TemplateRef<any>;
  @Input() activeIdx = 0;
  @Output() slideBtnClick = new EventEmitter<nzCarouselMoveType>();

  constructor() {
  }

  ngOnInit(): void {
  }

  onSlideBtnClick(type: nzCarouselMoveType): void {
    this.slideBtnClick.emit(type);
  }
}
