import {PlaylistTrack} from './PlaylistTrack';

export class Playlist {
  public id?: number;
  public name?: string;
  public coverImgId?: number;
  public coverImgUrl?: string;
  public adType?: number;
  public userId?: number;
  public createTime?: number;
  public status?: number;
  public opRecommend?: boolean;
  public highQuality?: boolean;
  public newImported?: boolean;
  public updateTime?: number;
  public trackCount?: number;
  public specialType?: number;
  public privacy?: number;
  public trackUpdateTime?: number;
  public commentThreadId?: string;
  public playCount?: number;
  public trackNumberUpdateTime?: number;
  public subscribedCount?: number;
  public cloudTrackCount?: number;
  public ordered?: boolean;
  public description?: string;
  public tags?: string[];
  public updateFrequency?: any;
  public backgroundCoverId?: number;
  public backgroundCoverUrl?: any;
  public titleImage?: number;
  public titleImageUrl?: any;
  public englishTitle?: any;
  public officialPlaylistType?: any;
  public subscribers?: PlaylistSubscribers[];
  public subscribed?: any;
  public creator?: PlaylistCreator;
  public tracks: PlaylistTrack[] = [];
  public videoIds?: any;
  public videos?: any;
  public trackIds?: PlaylistTrackId[];
  public shareCount?: number;
  public commentCount?: number;
  public remixVideo?: any;
  public sharedUsers?: any;
  public historySharedUsers?: any;
}

export class PlaylistTrackId {
  public id?: number;
  public v?: number;
  public t?: number;
  public at?: number;
  public alg?: any;
  public uid?: number;
  public rcmdReason?: string;
}

export class PlaylistCreator {
  public defaultAvatar?: boolean;
  public province?: number;
  public authStatus?: number;
  public followed?: boolean;
  public avatarUrl?: string;
  public accountStatus?: number;
  public gender?: number;
  public city?: number;
  public birthday?: number;
  public userId?: number;
  public userType?: number;
  public nickname?: string;
  public signature?: string;
  public description?: string;
  public detailDescription?: string;
  public avatarImgId?: number;
  public backgroundImgId?: number;
  public backgroundUrl?: string;
  public authority?: number;
  public mutual?: boolean;
  public expertTags?: any;
  public experts?: any;
  public djStatus?: number;
  public vipType?: number;
  public remarkName?: any;
  public authenticationTypes?: number;
  public avatarDetail?: any;
  public avatarImgIdStr?: string;
  public backgroundImgIdStr?: string;
  public anchor?: boolean;
}

export class PlaylistSubscribers {
  public defaultAvatar?: boolean;
  public province?: number;
  public authStatus?: number;
  public followed?: boolean;
  public avatarUrl?: string;
  public accountStatus?: number;
  public gender?: number;
  public city?: number;
  public birthday?: number;
  public userId?: number;
  public userType?: number;
  public nickname?: string;
  public signature?: string;
  public description?: string;
  public detailDescription?: string;
  public avatarImgId?: number;
  public backgroundImgId?: number;
  public backgroundUrl?: string;
  public authority?: number;
  public mutual?: boolean;
  public expertTags?: any;
  public experts?: any;
  public djStatus?: number;
  public vipType?: number;
  public remarkName?: any;
  public authenticationTypes?: number;
  public avatarDetail?: any;
  public avatarImgIdStr?: string;
  public backgroundImgIdStr?: string;
  public anchor?: boolean;
}
