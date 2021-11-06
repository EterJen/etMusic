import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/internal/operators';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import BannersResult from '../../data-types/results/BannersResult';
import {Banner} from '../../data-types/entitys/Banner';
import {Tag} from '../../data-types/entitys/Tag';
import HotPlaylist from '../../data-types/results/HotPlaylist';
import {SongSheet} from '../../data-types/entitys/SongSheet';
import Personalized from '../../data-types/results/Personalized';
import {NeteaseCloudMusicApiPrefix, ServiceModule} from '../service.module';

@Injectable({
  providedIn: ServiceModule
})
export class TagService {

  constructor(
    private http: HttpClient,
    @Inject(NeteaseCloudMusicApiPrefix) private neteaseCloudMusicApiPrefix: string
  ) {
  }

  /*
  * 热门歌单分类
  * */
  getHotTags(): Observable<Tag[]> {
    return this.http.get<HotPlaylist>(this.neteaseCloudMusicApiPrefix + '/playlist/hot').pipe<Tag[]>(
      map((res) => {
        if (200 === res.code && res.tags) {
          return res.tags.sort((a, b) => {
            return a.position - b.position;
          }).slice(0, 5);
        }
        return [];
      })
    );
  }


}
