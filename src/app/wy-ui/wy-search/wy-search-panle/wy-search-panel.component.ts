import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SearchSuggestResult} from '../../../data-types/results/SearchSuggest';
import {Router} from '@angular/router';

@Component({
  selector: 'app-wy-search-panle',
  templateUrl: './wy-search-panel.component.html',
  styleUrls: ['./wy-search-panel.component.less']
})
export class WySearchPanelComponent implements OnInit {
  @Input() public searchSuggestResult!: SearchSuggestResult;
  @Input() public keywordsReg?: RegExp;
  @Output() closeSearchPanel = new EventEmitter<void>();

  constructor(
    private router: Router,
  ) {
  }

  viewTargetTrack(id: number | undefined): void {
    if (id === undefined) {
      return;
    }
    this.router.navigate(['/', 'song', 'info', id]);
    this.closeSearchPanel.emit();
  }

  viewSinger(id: number): void {
    this.router.navigate(['/', 'singer', 'detail', id]);
    this.closeSearchPanel.emit();
  }

  viewSheet(id: number): void {
    this.router.navigate(['sheet', 'info', id]);
    this.closeSearchPanel.emit();
  }

  ngOnInit(): void {
  }

}
