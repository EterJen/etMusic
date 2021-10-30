export function limitNumberInRange(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}


export function calcPresent(val: number | null, min: number, max: number): number {
  if (val === null) {
    return 0;
  } else {
    return (val - min) / (max - min) * 100;
  }
}


/*
* 取随机整数
* [min, max]
* 闭区间
* x=math.random*A; 这里随机取到的值的范围:0<=x<A间
* Math.random() 包括0,但是不包括1!
* */
export function getRandomInt(range: [number, number]): number {
  return Math.floor(Math.random() * (range[1] - range[0] + 1) + range[0]);
}
