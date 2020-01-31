export default class StringUtils {
  public static stringIsNullOrEmpty (str: string | undefined | null): boolean {
    return !(str && str.length);
  }

  public static stringTrimEnd (str: string, char: string): string {
    if (!this.stringIsNullOrEmpty(str)) {
      if (str.endsWith(char)) {
        str = str.slice(0, -1);
      }
    }
    return str;
  }

  public static stringTrimStart (str: string, char: string): string {
    if (!this.stringIsNullOrEmpty(str)) {
      if (str.startsWith(char)) {
        str = str.substr(1);
      }
    }
    return str;
  }

  public static stringTrim (str: string, char: string): string {
    str = this.stringTrimEnd(str, char);
    str = this.stringTrimStart(str, char);
    return str
  }

  public static concat (str1: string, sep: string, str2: string): string {
    str1 = this.stringTrimEnd(str1, sep);
    str2 = this.stringTrimStart(str2, sep);

    return str1.concat(sep, str2);
  }

  public static replaceRnToBr (txt: string): string {
    if (this.stringIsNullOrEmpty(txt)) {
      return '';
    }

    return txt.replace(/(?:\r\n|\r|\n)/g, '<br />');
  }
}
