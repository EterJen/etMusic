import {Injectable} from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable, of} from 'rxjs';
import SongSheetDetail from '../../../data-types/results/SongSheetDetail';
import {SongSheetService} from '../../../services/bz/songSheet.service';
import {NgResolver} from '../../../data-types/ng/NgResolver';


@Injectable()
export class SheetInfoResolver implements Resolve<SongSheetDetail> {
  constructor(
    private songSheetService: SongSheetService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SongSheetDetail> {
    return this.songSheetService.getSongSheetDetail(Number(route.paramMap.get('id')));
  }
}



export const sheetInfoResolver: NgResolver = {
  resolver: SheetInfoResolver,
};
