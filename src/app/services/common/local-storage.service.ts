import {Injectable} from '@angular/core';
import {ServiceModule} from '../service.module';
import {CryptoService} from './crypto.service';

@Injectable({
  providedIn: ServiceModule
})
export class LocalStorageService {

  constructor(
    private cryptoService: CryptoService
  ) {
  }

  public setCryptoItem(key: string, value: any): void {
    this.setItem(this.cryptoService.encrypt(key), this.cryptoService.encrypt(JSON.stringify(value)));
  }

  public getCryptoItem(key: string): any {
    const res = this.getItem(this.cryptoService.encrypt(key));
    if (null !== res) {
      return JSON.parse(this.cryptoService.decrypt(res));
    }
    return res;
  }

  removeCryptoItem(key: string): void {
    this.removeItem(this.cryptoService.encrypt(key));
  }

  public setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public getItem(key: string): any {
    const value = localStorage.getItem(key);
    if (null !== value) {
      return JSON.parse(value);
    } else {
      return null;
    }
  }

  removeItem(cellphoneLoginKey: string): void {
    localStorage.removeItem(cellphoneLoginKey);
  }
}
