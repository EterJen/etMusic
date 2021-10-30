import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {SimpleStyle} from '../../../data-types/types/simple.style';

@Component({
  selector: 'app-wy-slider-handle',
  templateUrl: './wy-slider-handle.component.html',
  styleUrls: ['./wy-slider-handle.component.less'],
})
export class WySliderHandleComponent implements OnInit, OnChanges {
  @Input() sliderIsVertical = false;
  @Input() dragAble = false;
  @Input() sliderOffset = 0;
  style: SimpleStyle = {};

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.sliderOffset) {
      if (this.sliderIsVertical) {
        this.style.bottom = this.sliderOffset + '%';
      } else {
        this.style.left = this.sliderOffset + '%';
      }
    }
  }

  ngOnInit(): void {
  }

}
