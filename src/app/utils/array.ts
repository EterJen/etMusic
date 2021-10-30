import {getRandomInt} from './number';

export function inArray(arr: any[], target: any): boolean {
  return arr.indexOf(target) !== -1;
}

export function simpleFindIndex(arr: any[], target: any, byFiled?: string): number {
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
export function shuffle<T>(src: T[]): T[] {
  const result = src.slice();
  for (let i = 0; i < result.length; i++) {
    const j = getRandomInt([0, i]);
    [result[i], result[j]] = [result[j], result[i]]; // 排序的本质就是交换位置 随机排序就是随机交换
  }
  return result;
}
