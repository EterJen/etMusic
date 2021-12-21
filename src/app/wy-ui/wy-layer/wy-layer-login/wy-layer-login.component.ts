import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ModalType} from '../../../app-store/wy-layer-store/reducer';
import {WyLayerStoreService} from '../../../app-store/wy-layer-store/wy-Layer-store.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CellphoneLoginParams, MemberService} from '../../../services/bz/member.service';
import LoginInfo from '../../../data-types/results/LoginInfo';
import {NzMessageService} from 'ng-zorro-antd/message';
import {IErrorInfo} from '../../../services/http-config/common-interface';
import {WyUserStoreService} from '../../../app-store/wy-user-store/wy-user-store.service';

@Component({
  selector: 'app-wy-layer-login',
  templateUrl: './wy-layer-login.component.html',
  styleUrls: ['./wy-layer-login.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerLoginComponent implements OnInit {
  ModalType = ModalType;
  loginForm!: FormGroup;
  @Input() cellphoneLoginParams!: CellphoneLoginParams;
  df = {phone: 'phone'};

  constructor(
    private wyLayerStoreService: WyLayerStoreService,
    private formBuilder: FormBuilder,
    private memberService: MemberService,
    private wyUserStoreService: WyUserStoreService,
    private nzMessageService: NzMessageService
  ) {
    /**
     * 可以嵌套 非常强大 自带校验
     * ngModel 相对简单 没有校验
     */
    this.wyUserStoreService.watchWyUserCellphoneLoginParams().subscribe((cellphoneLoginParams) => {
      if (null === cellphoneLoginParams) {
        cellphoneLoginParams = {phone: '', password: '', setting: {remember: false}};
      }
      if (this.loginForm) {
        this.loginForm.reset(); // 再次赋值前重置一下
      }
      this.loginForm = this.formBuilder.group({
        phone: [cellphoneLoginParams.phone, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
        password: [cellphoneLoginParams.password, [Validators.required, Validators.minLength(6)]],
        setting: this.formBuilder.group(
          {
            remember: [cellphoneLoginParams.setting.remember],
          }
        ),
      });
    });
  }

  ngOnInit(): void {
  }

  openLayerModal(modalType: ModalType): void {
    this.wyLayerStoreService.wyLayerModalDispatch(true, modalType);
  }

  hide(): void {
    this.wyLayerStoreService.wyLayerModalDispatch(false, ModalType.Default);
  }

  loginFormSubmit(): void {
    if (this.loginForm.valid) {
      this.memberService.cellphoneLogin(this.loginForm.value).subscribe((res) => {
          if (200 === res.code) {
            this.nzMessageService.success('登陆成功');
            this.memberService.storeUserId((res as LoginInfo)?.profile?.userId);
            const ifRemember = this.loginForm.get(['setting', 'remember'])?.value;
            let cellphoneLoginParams: CellphoneLoginParams = this.loginForm.value;
            if (true === ifRemember) {
              this.memberService.rememberCellphoneLogin(cellphoneLoginParams);
            } else {
              cellphoneLoginParams = {phone: '', setting: {remember: false}, password: ''};
              this.memberService.forgetCellphoneLogin();
            }
            this.wyUserStoreService.flexSet({loginInfo: (res as LoginInfo), cellphoneLoginParams});
            this.hide();
          } else {
            this.nzMessageService.error('' + (res as IErrorInfo).message);
          }
        }
      );
    }
  }

}
