import {Injectable} from '@angular/core';
import {ServiceModule} from '../service.module';

@Injectable({
  providedIn: ServiceModule
})
export class LocalStorageService {

  constructor() {
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
