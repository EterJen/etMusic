import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SimpleStyle} from '../../../../data-types/types/simple.style';

@Component({
  selector: 'app-wy-slider-track',
  templateUrl: './wy-slider-track.component.html',
  styleUrls: ['./wy-slider-track.component.less']
})
export class WySliderTrackComponent implements OnInit, OnChanges {
  @Input() sliderIsVertical = false;
  @Input() isBufferSlider = false;
  @Input() sliderOffset = 0;
  @Input() sliderBufferOffset = 0;
  style: SimpleStyle = {};

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.sliderOffset) {
      if (this.sliderIsVertical) {
        this.style.height = this.sliderOffset + '%';
        this.style.width = undefined;
        this.style.left = undefined;
      } else {
        this.style.width = this.sliderOffset + '%';
        this.style.height = undefined;
        this.style.bottom = undefined;
      }
    }else if (changes.sliderBufferOffset) {
      if (!this.sliderIsVertical) {
        this.style.width = this.sliderBufferOffset + '%';
        this.style.height = undefined;
        this.style.bottom = undefined;
      }
    }
  }

  ngOnInit(): void {
  }

}
