import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SimpleStyle} from '../../../../data-types/types/simple.style';

@Component({
  selector: 'app-wy-slider-track',
  templateUrl: './wy-slider-track.component.html',
  styleUrls: ['./wy-slider-track.component.less']
})
export class WySliderTrackComponent implements OnInit, OnChanges {
  @Input() sliderVertical = false;
  @Input() sliderLength = 0;
  style: SimpleStyle = {};

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.sliderLength) {
      if (this.sliderVertical) {
        this.style.height = this.sliderLength + '%';
        this.style.width = undefined;
        this.style.left = undefined;
      } else {
        this.style.width = this.sliderLength + '%';
        this.style.height = undefined;
        this.style.bottom = undefined;
      }
    }
  }

  ngOnInit(): void {
  }

}
