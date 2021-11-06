import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SongSheet} from '../../../data-types/entitys/SongSheet';
import {SongSheetService} from '../../../services/bz/songSheet.service';
import {Playlist} from '../../../data-types/entitys/Playlist';

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

  constructor() {
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

  onPlaySheet(id: number): void {
    this.playSheet.emit(id);
  }
}
