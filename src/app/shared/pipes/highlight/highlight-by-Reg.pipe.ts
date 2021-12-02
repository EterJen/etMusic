import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'highlightByReg'
})
export class HighlightByRegPipe implements PipeTransform {

  /*
  * 建议将reg作为参素传递 不要每次都new 无意义的资源浪费
  * */
  transform(rawStr: string | undefined, reg: RegExp | undefined): string {
    if (rawStr) {
      if (reg) {
        return rawStr.replace(reg, '<span class="highlight">$&</span>');
      } else {
        return rawStr;
      }
    } else {
      return '';
    }
  }

}
