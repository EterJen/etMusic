import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SongSheet} from '../../../data-types/entitys/SongSheet';
import {Playlist} from '../../../data-types/entitys/Playlist';
import {EventUtils} from '../../../utils/EventUtils';
import {Router} from '@angular/router';

@Component({
  selector: 'app-single-sheet',
  templateUrl: './single-sheet.component.html',
  styleUrls: ['./single-sheet.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleSheetComponent implements OnInit {
  @Input() songSheet?: SongSheet;
  @Input() playlist?: Playlist;
  realSheet!: SongSheet | Playlist;
  @Output() playSheet = new EventEmitter<number>();

  constructor(
    private router: Router
  ) {
  }

  get picUrl(): string | undefined {
    if (this.songSheet) {
      return this.songSheet.picUrl;
    } else if (this.playlist) {
      return this.playlist.coverImgUrl;
    }
    return undefined;
  }

  ngOnInit(): void {
    if (this.songSheet) {
      this.realSheet = this.songSheet;
    } else if (this.playlist) {
      this.realSheet = this.playlist;
    }
  }

  onPlaySheet(id: number, $event: MouseEvent): void {
    EventUtils.prohibitEventBubbling($event);
    this.playSheet.emit(id);
  }

  showSheet(): void {
    this.router.navigate(['sheet', 'info', this.realSheet.id]);
  }
}
