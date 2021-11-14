import {PlaylistTrack} from '../entitys/PlaylistTrack';
import {Privilege} from '../entitys/Privilege';

export default class SongsDetail {
  public songs?: PlaylistTrack[];
  public privileges?: Privilege[];
  public code?: number;
}
