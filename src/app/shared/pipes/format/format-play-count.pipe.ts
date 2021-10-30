import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'formatPlayCount'
})
export class FormatPlayCountPipe implements PipeTransform {

  transform(src: number): string | number {
    if (src > 10000) {
      return Math.floor(src / 10000) + '万';
    } else {
      return src;
    }
  }

}
