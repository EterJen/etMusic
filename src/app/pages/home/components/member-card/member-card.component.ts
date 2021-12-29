import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {WyUserStoreService} from '../../../../app-store/wy-user-store/wy-user-store.service';
import LoginInfo from '../../../../data-types/results/LoginInfo';
import {MemberService} from '../../../../services/bz/member.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.less']
})
export class MemberCardComponent implements OnInit {
  @Output() userLogin = new EventEmitter<void>();
  public loginInfo!: LoginInfo | null;
  public dailySignInMsg = '';

  constructor(
    private wyUserStoreService: WyUserStoreService,
    private memberService: MemberService,
  ) {
  }

  ngOnInit(): void {
    this.wyUserStoreService.watchWyUserLoginInfo().subscribe((res) => {
      this.loginInfo = res;
      console.log(this.loginInfo);
    });
  }

  dailySignIn(): void {
    this.memberService.dailySignIn(1).subscribe((res) => {
      if (res.code === 200) {
        this.dailySignInMsg = '签到成功，积分+' + res.point;
      } else {
        this.dailySignInMsg = '签到失败，' + res.msg;
      }
    });
  }

  clearDailySignInMsg(): void {
    this.dailySignInMsg = '';
  }
}
