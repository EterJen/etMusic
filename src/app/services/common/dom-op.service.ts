import {Inject, Injectable} from '@angular/core';
import {ServiceModule, WINDOW} from '../service.module';
import {DOCUMENT} from '@angular/common';

@Injectable({
  providedIn: ServiceModule
})
export class DomOpService {
  constructor(
    @Inject(WINDOW) private win: Window,
    @Inject(DOCUMENT) private doc: Document,
  ) {

  }

  getHideDomSize(dom: HTMLElement): { w: number, h: number } {
    return {
      w: dom.offsetWidth,
      h: dom.offsetHeight
    };
  }

  getWindowSize(): { w: number, h: number } {
    return {
      w: this.win.innerWidth || this.doc.documentElement.clientWidth || this.doc.body.offsetWidth,
      h: this.win.innerHeight || this.doc.documentElement.clientHeight || this.doc.body.offsetHeight,
    };
  }
}
