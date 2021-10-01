export class Privilege {
  public id?: number;
  public fee?: number;
  public payed?: number;
  public realPayed?: number;
  public st?: number;
  public pl?: number;
  public dl?: number;
  public sp?: number;
  public cp?: number;
  public subp?: number;
  public cs?: boolean;
  public maxbr?: number;
  public fl?: number;
  public pc?: any;
  public toast?: boolean;
  public flag?: number;
  public paidBigBang?: boolean;
  public preSell?: boolean;
  public playMaxbr?: number;
  public downloadMaxbr?: number;
  public rscl?: any;
  public freeTrialPrivilege?: FreeTrialPrivilege;
  public chargeInfoList?: PrivilegeChargeInfo[];
}


export class FreeTrialPrivilege {
  public resConsumable?: boolean;
  public userConsumable?: boolean;
}

export class PrivilegeChargeInfo {
  public rate?: number;
  public chargeUrl?: any;
  public chargeMessage?: any;
  public chargeType?: number;
}
