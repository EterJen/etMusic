import {Artist} from '../entitys/Artist';
import {Playlist} from '../entitys/Playlist';
import {PlaylistTrack} from '../entitys/PlaylistTrack';

export default class SearchSuggest {
  public result!: SearchSuggestResult;
  public code?: number;
}

export class SearchSuggestResult {
  public albums?: Album[];
  public artists?: Artist[];
  public songs?: PlaylistTrack[];
  public playlists?: Playlist[];
  public order?: string[];
}





export class Album {
  public id?: number;
  public name?: string;
  public artist?: Artist;
  public publishTime?: number;
  public size?: number;
  public copyrightId?: number;
  public status?: number;
  public picId?: number;
  public mark?: number;
}


