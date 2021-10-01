export class Song {
  public id?: number;
  public url?: string;
  public br?: number;
  public size?: number;
  public md5?: string;
  public code?: number;
  public expi?: number;
  public type?: string;
  public gain?: number;
  public fee?: number;
  public uf?: any;
  public payed?: number;
  public flag?: number;
  public canExtend?: boolean;
  public freeTrialInfo?: any;
  public level?: string;
  public encodeType?: string;
  public freeTrialPrivilege?: SongFreeTrialPrivilege;
  public freeTimeTrialPrivilege?: SongFreeTimeTrialPrivilege;
  public urlSource?: number;
}

export class SongFreeTrialPrivilege {
  public resConsumable?: boolean;
  public userConsumable?: boolean;
}

export class SongFreeTimeTrialPrivilege {
  public resConsumable?: boolean;
  public userConsumable?: boolean;
  public type?: number;
  public remainTime?: number;
}
