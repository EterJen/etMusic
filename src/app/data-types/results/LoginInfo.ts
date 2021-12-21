export default class LoginInfo {
  public loginType?: number;
  public code?: number;
  public account?: Account;
  public token?: string;
  public profile?: Profile;
  public bindings?: Bindings[];
  public cookie?: string;
}

export class SampleBack {
  public code?: number;

  [key: string]: any;
}

export class Account {
  public id?: number;
  public userName?: string;
  public type?: number;
  public status?: number;
  public whitelistAuthority?: number;
  public createTime?: number;
  public salt?: string;
  public tokenVersion?: number;
  public ban?: number;
  public baoyueVersion?: number;
  public donateVersion?: number;
  public vipType?: number;
  public viptypeVersion?: number;
  public anonimousUser?: boolean;
  public uninitialized?: boolean;
}

export class Profile {
  public detailDescription?: string;
  public followed?: boolean;
  public backgroundUrl?: string;
  public backgroundImgIdStr?: string;
  public avatarImgIdStr?: string;
  public userId?: number;
  public accountStatus?: number;
  public vipType?: number;
  public gender?: number;
  public avatarImgId?: number;
  public nickname?: string;
  public backgroundImgId?: number;
  public birthday?: number;
  public city?: number;
  public avatarUrl?: string;
  public defaultAvatar?: boolean;
  public province?: number;
  public expertTags?: any;
  public mutual?: boolean;
  public remarkName?: any;
  public authStatus?: number;
  public djStatus?: number;
  public description?: string;
  public userType?: number;
  public signature?: string;
  public authority?: number;
  public avatarImgId_str?: string;
  public followeds?: number;
  public follows?: number;
  public eventCount?: number;
  public avatarDetail?: any;
  public playlistCount?: number;
  public playlistBeSubscribedCount?: number;
}

export class Bindings {
  public userId?: number;
  public bindingTime?: number;
  public tokenJsonStr?: string;
  public expiresIn?: number;
  public refreshTime?: number;
  public url?: string;
  public expired?: boolean;
  public id?: number;
  public type?: number;
}
