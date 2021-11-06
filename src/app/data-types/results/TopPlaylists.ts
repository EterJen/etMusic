import {Playlist} from '../entitys/Playlist';

export default class TopPlaylists {
  public playlists?: Playlist[];
  public total?: number;
  public code?: number;
  public more?: boolean;
  public cat?: string;
}
