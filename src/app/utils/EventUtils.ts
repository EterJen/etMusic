export class EventUtils {
  /*阻止事件冒泡*/
  public static prohibitEventBubbling(e: Event): void {
    e.stopPropagation();
    e.preventDefault();
  }
}
