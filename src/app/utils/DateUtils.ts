export class DateUtils {

  /**
   * GMT时间转换为 正常北京时间(string类型)
   */
  GMT2Str(time: Date): string {
    const date = new Date(time);
    const Str = date.getFullYear() + '-' +
      (date.getMonth() + 1) + '-' +
      date.getDate() + ' ' +
      date.getHours() + ':' +
      date.getMinutes() + ':' +
      date.getSeconds();
    return Str;
  }

  /**
   * string类型转date 时间戳
   */

  public str2date(date: string): string {

    console.log('日期转换：');
    console.log(date);


    // 前台数据转换获得时间戳 传给后台
    const dateM = Date.parse(date);
    // console.log(date_m);

    // 将时间戳转换为GMT 格式时间
    const strDate = new Date(dateM);
    // console.log(strDate);

    // 得到正常北京时间
    const GMTDate = this.GMT2Str(strDate);
    // console.log(GMTDate);

    // 返回时间戳
    return GMTDate;
  }


}
