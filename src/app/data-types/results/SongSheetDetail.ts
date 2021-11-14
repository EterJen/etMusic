import {Playlist} from '../entitys/Playlist';
import {Privilege} from '../entitys/Privilege';

export default class SongSheetDetail {
  public code?: number;
  public relatedVideos?: any;
  public playlist!: Playlist;
  public urls?: any;
  public privileges?: Privilege[];
  public sharedPrivilege?: any;
}
