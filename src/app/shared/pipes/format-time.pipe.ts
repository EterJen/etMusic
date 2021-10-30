import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  transform(seconds: number): string {
    if (seconds) {
      const temp = Math.floor(seconds); // 向下取整
      const minute = Math.floor(temp / 60);
      const secondStr = Math.floor(temp % 60).toString().padStart(2, '0');
      return `${minute}:${secondStr}`;
    } else {
      return '00:00';
    }
  }

}
