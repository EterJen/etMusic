import {Song} from './Song';

export class PlaylistTrack {
  public name?: string;
  public id!: number;
  public pst?: number;
  public t?: number;
  public song?: Song;
  public ar?: SongAr[];
  public pop?: number;
  public st?: number;
  public rt?: string;
  public fee?: number;
  public v?: number;
  public crbt?: any;
  public cf?: string;
  public al!: SongAl;
  /*dt时长*/
  public dt!: number;
  public h?: SongH;
  public m?: SongM;
  public l?: SongL;
  public a?: any;
  public cd?: string;
  public no?: number;
  public rtUrl?: any;
  public ftype?: number;
  public djId?: number;
  public copyright?: number;
  public mark?: number;
  public originCoverType?: number;
  public originSongSimpleData?: any;
  public single?: number;
  public noCopyrightRcmd?: any;
  public rtype?: number;
  public rurl?: any;
  public mst?: number;
  public cp?: number;
  public mv?: number;
  public publishTime?: number;
}







export class SongH {
  public br?: number;
  public fid?: number;
  public size?: number;
  public vd?: number;
}

export class SongM {
  public br?: number;
  public fid?: number;
  public size?: number;
  public vd?: number;
}

export class SongL {
  public br?: number;
  public fid?: number;
  public size?: number;
  public vd?: number;
}
export class SongAr {
  public id?: number;
  public name?: string;
}

/*专辑*/
export class SongAl {
  public id?: number;
  public name?: string;
  public picUrl!: string;
  public pic?: number;
}




