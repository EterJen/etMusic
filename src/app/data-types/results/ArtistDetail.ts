import {Artist} from '../entitys/Artist';
import {PlaylistTrack} from '../entitys/PlaylistTrack';

export default class ArtistDetail {
  public artist!: Artist;
  public hotSongs!: PlaylistTrack[];
  public more?: boolean;
  public code?: number;
}

