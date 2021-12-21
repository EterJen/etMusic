export class ObjUtils {
  public static isEmptyObject(obj: any): boolean {
    return JSON.stringify(obj) === '{}';
  }
  public static isNotEmptyObject(obj: any): boolean {
    return !this.isEmptyObject(obj);
  }
}
