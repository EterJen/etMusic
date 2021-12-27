import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {WyUserStoreService} from '../../../../app-store/wy-user-store/wy-user-store.service';
import LoginInfo from '../../../../data-types/results/LoginInfo';
import {MemberService} from '../../../../services/bz/member.service';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.less']
})
export class MemberCardComponent implements OnInit {
  @Output() userLogin = new EventEmitter<void>();
  public loginInfo!: LoginInfo | null;

  constructor(
    private wyUserStoreService: WyUserStoreService,
    private memberService: MemberService,
    private nzMessageService: NzMessageService,
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
        this.nzMessageService.success('签到成功，积分+' + res.point);
      } else {
        this.nzMessageService.error('签到失败，' + res.msg);
      }
    });
  }
}
