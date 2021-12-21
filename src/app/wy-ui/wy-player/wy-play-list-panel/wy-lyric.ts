import Lyric from '../../../data-types/entitys/Lyric';
import {PartialObserver, Subject, Subscription} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';

/*
* [02:11.49]
* */
// export const lyricTimeExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;
// export const lyricTimeExp = /\[(\d{2}):(\d{2})(\.\d{2,3})?\]/g;
export const lyricTimeExp = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/g;

export interface BaseLyricLine {
  txt: string;
  txtCn: string;
}

export interface LyricLine extends BaseLyricLine {
  time: number;
}

export interface PlayingLine {
  songId: number;
  currentPlayingTime: number;
  prePlayLyricIndex: number;
}

export class WyLyric {

  lyricLines: LyricLine[];
  private prepared = false;
  private lyric: Lyric | null;
  private lyricLineMap: Map<number, LyricLine>;
  private playingIndexSubject: Subject<PlayingLine>;
  private playingIndexObserver: PartialObserver<PlayingLine>;
  private playingIndexSubscription?: Subscription;

  constructor(playingIndexObserver: PartialObserver<PlayingLine>) {
    this.playingIndexObserver = playingIndexObserver;
    this.lyric = null;
    this.lyricLines = [];
    this.lyricLineMap = new Map<number, LyricLine>();
    this.playingIndexSubject = new Subject<PlayingLine>();
  }

  clear(): void {
    this.playingIndexSubscription?.unsubscribe();
    this.prepared = false;
    this.lyricLines = [];
    this.lyricLineMap.clear();
    this.lyric = null;
  }

  parseLyric(lyric: Lyric | null): this {
    this.clear();
    this.lyric = lyric;

    if (this.lyric?.tlyric?.lyric) {
      this.genericTLyric();
    }
    if (this.lyric?.lrc?.lyric) {
      this.genericLyric();
    }

    if (this.lyricLines.length) {
      /*
      * 若能保证歌词按规则提供 可不排序
      * */
      this.lyricLines = this.lyricLines.sort((a, b) => {
        return a.time - b.time;
      });

      this.observerPlayingIndex();
      this.prepared = true;
    }
    return this;
  }

  playAt(playingLine: PlayingLine): void {
    if (!this.prepared) {
      return;
    }
    /*
    * prePlayLyricIndex存在一个提前值的概念
    * 因为过滤条件是：currentPlayingTime <= item.time
    * 意味着需要等待一段时间后才是真的开始播放目标歌词
    * */
    const prePlayLyricIndex = this.lyricLines.findIndex(item => {
      // 歌词列表time 逐渐增大 找到的第一个比当前播放时间大或等于的作为即将展示的歌词
      return playingLine.currentPlayingTime <= item.time;
    });
    if (prePlayLyricIndex !== -1) {
      this.playingIndexSubject.next({...playingLine, prePlayLyricIndex});
    }
  }

  /*
  * 打开订阅
  * */
  observerPlayingIndex(): void {
    /*
    * distinctUntilChanged 默认使用 === 做比较两个连续值 重复则不会触发订阅
    * 同时提供一个比较函数作为参数 方便自定义复杂对象比较（如按ID进行比较）
    * */
    const playingLineEqual = (v1: PlayingLine, v2: PlayingLine): boolean => {
      return v1.prePlayLyricIndex === v2.prePlayLyricIndex;
    };


    this.playingIndexSubscription = this.playingIndexSubject.pipe(
      distinctUntilChanged(playingLineEqual),
    ).subscribe(this.playingIndexObserver);
  }

  private genericLyric(): void {
    const lines = this.lyric?.lrc?.lyric?.split('\n');
    // node里的forEach()是同步的！！
    lines?.forEach(item => {
      this.makeLine(item, true);
    });
  }

  private genericTLyric(): void {
    const lines = this.lyric?.tlyric?.lyric?.split('\n');
    // node里的forEach()是同步的！！
    lines?.forEach(item => {
      this.makeLine(item, false);
    });
  }

  private makeLine(rawLine: string, original: boolean): void {
    const match = lyricTimeExp.exec(rawLine);
    if (match) {
      const lyric = rawLine.replace(lyricTimeExp, '').trim();
      if (lyric) {
        let ms = Number(match[3] || '00');
        if (ms < 100) { // 两位的时候其实是省去了后面的0
          ms = ms * 10;
        }
        const min = Number(match[1]);
        const sec = Number(match[2]);
        const time = min * 60 * 1000 + sec * 1000 + ms;
        const lyricLine = this.lyricLineMap.get(time);
        if (lyricLine) {
          if (original) {
            lyricLine.txt = lyric;
          } else {
            lyricLine.txtCn = lyric;
          }
        } else {
          const temp = {txt: '', txtCn: '', time};
          if (original) {
            temp.txt = lyric;
          } else {
            temp.txtCn = lyric;
          }
          this.lyricLines.push(temp);
          this.lyricLineMap.set(time, temp);
        }
      }
    }
  }


}
