import {NumberUtils} from './NumberUtils';

export class ArrayUtils {
  public static simpleFindIndex(arr: any[], target: any, byFiled?: string): number {
    let compareBy = 'id';
    if (byFiled) {
      compareBy = byFiled;
    }
    return arr.findIndex(iterm => {
      return iterm[compareBy] === target[compareBy];
    });
  }

  /*
  * 数组随机排序
  * 洗牌算法
  * */
  public static shuffle<T>(src: T[]): T[] {
    const result = src.slice();
    for (let i = 0; i < result.length; i++) {
      const j = NumberUtils.getRandomInt([0, i]);
      [result[i], result[j]] = [result[j], result[i]]; // 排序的本质就是交换位置 随机排序就是随机交换
    }
    return result;
  }
  public static inArray(arr: any[], target: any): boolean {
    return arr.indexOf(target) !== -1;
  }
}
