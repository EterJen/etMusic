import {PlaylistTag} from './PlaylistTag';

export class Tag {
  public playlistTag?: PlaylistTag;
  public activity?: boolean;
  public hot?: boolean;
  public usedCount?: number;
  public position = 0;
  public category?: number;
  public createTime?: number;
  public name?: string;
  public id?: number;
  public type?: number;
}
