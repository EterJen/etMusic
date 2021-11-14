export class HtmlConvertUtils {
  public static parse(raw: string): string {
    return raw.slice().replace(/\n/g, '<br />');
  }
}
