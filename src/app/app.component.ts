import {Component} from '@angular/core';
import {Observable, of} from 'rxjs';
import {map, tap} from 'rxjs/internal/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'etMusic';

  constructor() {
    // this.f1();
    // this.f2();
    // this.f3();
    // this.f6();
    // this.f7();
  }

  f1(): void {
    const observable = of(1, 2, 3);
    observable.subscribe({next: num => console.log(num)});
  }

  f2(): void {
    const observable = Observable.create((subscriber: any) => {
      try {
        let time = 0;
        /*订阅者模拟http请求成功 将数据返回*/
        subscriber.next(1);
        subscriber.next(2);
        subscriber.next(3);
        const intervalId = setInterval(() => {
          console.log(`wait ${++time}s`);
        }, 900);
        setTimeout(() => {
          observer.next(4);
          clearInterval(intervalId);
        }, 2000);

      } catch (e) {
        subscriber.error(e);
      }
      subscriber.complete();
    });
    const observer = {
      next: (num: any) => console.log(num),
      error: (e: any) => console.log(e),
      complete: () => console.log('complete!!!'),
    };
    observable.subscribe(observer);
  }

  f3(): void {
    const obs = Observable.create((observer: any) => {
      observer.next(1);
      setTimeout(() => observer.next(2), 2000); // 等待两秒才发送下一个值
    });

    const suber = obs.subscribe({
      next: (x: any) => console.log('接收到：', x),
    });

    setTimeout(() => suber.unsubscribe(), 1000); // 在一秒后取消订阅
  }

  f5(): void {
    const observable = of(1, 2, 3);
    const opt = map((num: any) => 'hello world');
    const newObservable = opt(observable);
    newObservable.subscribe((data) => console.log(data), (data: any) => console.log(data));
  }

  f6(): void {
    const observable = of(1, 2, 3);
    const newObservable = observable.pipe(
      tap(num => {
        num++;
        console.log(num);
      }),
      map(num => 'hello world')
    );
    newObservable.subscribe(data => console.log(data));
  }

  f7(): void {
    const observable = Observable.create((subscriber: any) => {
      try {
        let time = 0;
        subscriber.next(1);
        subscriber.error('90'); /*error 后代码继续执行，但next completer不再被观察*/
        subscriber.next(2);
        subscriber.next(3);
        const intervalId = setInterval(() => {
          console.log(`wait ${++time}s`);
        }, 900);
        setTimeout(() => {
          subscriber.next(4);
          clearInterval(intervalId);
        }, 2000);

      } catch (e) {
        subscriber.error(e);
      }
      subscriber.complete();
    });
    const newObservable = observable.pipe(/*pipe 只拦截next tap先执行不改变值 map后可不改变值 最终返回新的可观察对象*/
      tap(num => {
        console.log('pipe tab start');
        console.log(num);
        num = 'tab xxx';
        console.log(num);
        console.log('pipe tab end');
      }),
      map(num => {
        console.log('pipe next start');
        console.log(num);
        console.log('pipe next end');
        return 'map 改变值';
      })
    );
    const observer = {
      next: (num: any) => {
        console.log('next  start');
        console.log(num);
        num = 'next' + num;
        console.log('next  end');
      },
      error: (e: any) => {
        console.log('error  start');
        console.log(e);
        e = 'next' + e;
        console.log('error  end');
      },
      complete: () => console.log('complete!!!'),
    };

    newObservable.subscribe(observer);
  }


}
