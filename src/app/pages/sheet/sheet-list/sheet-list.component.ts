import {Component, OnInit} from '@angular/core';
import {PlayListService, TopQueryParams} from '../../../services/bz/play-list.service';
import {ActivatedRoute} from '@angular/router';
import {SongSheetService} from '../../../services/bz/songSheet.service';
import TopPlaylists from '../../../data-types/results/TopPlaylists';

@Component({
  selector: 'app-song-sheets',
  templateUrl: './sheet-list.component.html',
  styleUrls: ['./sheet-list.component.less']
})
export class SheetListComponent implements OnInit {
  public topQueryParams: TopQueryParams = {
    cat: '全部',
    order: 'hot',
    offset: 1,
    limit: 15,
  };
  topPlaylists!: TopPlaylists;

  constructor(
    private playListService: PlayListService,
    private activatedRoute: ActivatedRoute,
    private songSheetService: SongSheetService,
  ) {
    this.topQueryParams.cat = this.activatedRoute.snapshot.queryParamMap.get('cat') || '全部';
    this.queryTopPlaylists();
  }

  public queryTopPlaylists(): void {
    this.playListService.queryTopPlaylists(this.topQueryParams).subscribe((topPlaylists: TopPlaylists) => {
      this.topPlaylists = topPlaylists;
    });
  }

  onPlaySheet(sheetId: number): void {
    this.songSheetService.playSheet(sheetId);
  }

  ngOnInit(): void {
  }

  onOrderChange(): void {
    this.topQueryParams.offset = 1;
    this.queryTopPlaylists();
  }
}
