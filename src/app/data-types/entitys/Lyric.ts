export default class Lyric {
  public sgc?: boolean;
  public sfy?: boolean;
  public qfy?: boolean;
  public transUser?: TransUser;
  public lrc?: Lrc;
  public klyric?: Klyric;
  public tlyric?: Tlyric;
  public code?: number;
}

export class TransUser {
  public id?: number;
  public status?: number;
  public demand?: number;
  public userid?: number;
  public nickname?: string;
  public uptime?: number;
}

export class Lrc {
  public version?: number;
  public lyric?: string;
}

export class Klyric {
  public version?: number;
  public lyric?: string;
}

export class Tlyric {
  public version?: number;
  public lyric?: string;
}
