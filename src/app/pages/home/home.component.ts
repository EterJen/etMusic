import {Component, OnInit, ViewChild} from '@angular/core';
import {FromToInterface, NzCarouselComponent} from 'ng-zorro-antd/carousel';
import {nzSlideType} from '../../data-types/consts/nz.slider.consts';
import {Banner} from '../../data-types/entitys/Banner';
import {Tag} from '../../data-types/entitys/Tag';
import {SongSheet} from '../../data-types/entitys/SongSheet';
import {Artist} from '../../data-types/entitys/Artist';
import {ActivatedRoute} from '@angular/router';
import {HomeRoutData} from './home-routing.module';
import {SongSheetService} from '../../services/http/bz/songSheet.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  banners: Banner[] = [];
  public activeIdx = 0;
  @ViewChild('nzCarousel', {static: true}) nzCarousel!: NzCarouselComponent;
  public hotTags: Tag[] = [];
  public personalizedRecommends: SongSheet[] = [];
  public artists: Artist[] = [];

  constructor(
    private route: ActivatedRoute,
    private songSheetService: SongSheetService
  ) {
    this.route.data.subscribe((res: HomeRoutData) => {
      const resolverData = res.resolverData;
      if (resolverData) {
        this.banners = resolverData.banners;
        this.hotTags = resolverData.hotTags;
        this.artists = resolverData.singers;
        this.personalizedRecommends = resolverData.personalizedRecommends;
      }
    });
  }

  ngOnInit(): void {
  }

  onBeforeChange($event: FromToInterface): void {
    this.activeIdx = $event.to;
  }


  onSlideBtnClick(type: nzSlideType): void {
    this.nzCarousel[type]();
  }

  onSheetPlay(sheetId: number): void {
    this.songSheetService.parseSongSheet(sheetId).subscribe((res) => {
      console.log(res);
    });
  }
}
