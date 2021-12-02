import {Injectable} from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {forkJoin, Observable, of} from 'rxjs';
import {Banner} from '../../data-types/entitys/Banner';
import {Tag} from '../../data-types/entitys/Tag';
import {SongSheet} from '../../data-types/entitys/SongSheet';
import {Artist} from '../../data-types/entitys/Artist';
import {ArtistService} from '../../services/bz/artist.service';
import {TagService} from '../../services/bz/tag.service';
import {SongSheetService} from '../../services/bz/songSheet.service';
import {BannerService} from '../../services/bz/banner.service';
import {first} from 'rxjs/operators';
import {ArtistQuery} from '../../data-types/params/ArtistQuery';
import {map} from 'rxjs/internal/operators';

export class HomeResolverData {
  public banners: Banner[] = [];
  public hotTags: Tag[] = [];
  public personalizedRecommends: SongSheet[] = [];
  public singers: Artist[] = [];


  constructor(banners: Banner[], hotTags: Tag[], personalizedRecommends: SongSheet[], singers: Artist[]) {
    this.banners = banners;
    this.hotTags = hotTags;
    this.personalizedRecommends = personalizedRecommends;
    this.singers = singers;
  }
}

/*
* 路由守卫 路由完才传递数据 防止{{}}，白页面 (页面渲染先于数据)
* */
@Injectable()
export class HomeResolver implements Resolve<HomeResolverData> {
  constructor(
    private artistService: ArtistService,
    private tagService: TagService,
    private songSheetService: SongSheetService,
    private bannerService: BannerService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<HomeResolverData> {
    const artistQuery = new ArtistQuery();
    artistQuery.limit = 9;
    return forkJoin([
      this.bannerService.getBanners(),
      this.tagService.getHotTags(),
      this.songSheetService.getPersonalizedRecommends(),
      this.artistService.artistList(artistQuery)
      ]
    ).pipe(first()).pipe(map(([banners, hotTags, personalizedRecommends, singers]) => {
      return new HomeResolverData(banners, hotTags, personalizedRecommends, singers);
    }));
  }
}
