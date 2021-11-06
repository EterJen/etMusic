import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() {
  }

  error(msg?: string, error?: string): void {
    console.log('msg' + msg);
    console.log('error' + error);
  }

}
