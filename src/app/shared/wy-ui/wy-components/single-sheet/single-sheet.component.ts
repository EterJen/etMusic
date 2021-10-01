import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SongSheet} from '../../../../data-types/entitys/SongSheet';
import {SongSheetService} from '../../../../services/http/bz/songSheet.service';

@Component({
  selector: 'app-single-sheet',
  templateUrl: './single-sheet.component.html',
  styleUrls: ['./single-sheet.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleSheetComponent implements OnInit {
  @Input() songSheet!: SongSheet;
  @Output() sheetPlay = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit(): void {
  }

  playSheet(id: number): void {
    this.sheetPlay.emit(id);
  }
}
