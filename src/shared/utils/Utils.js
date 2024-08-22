export class Utils
{
  static async sleep(time)
  {
    return new Promise((resolve) =>
    {
      setTimeout(resolve, time)
    })
  }

  static debounce(func, wait = 100)
  {
    let timeoutId;
    return function(...args)
    {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() =>
      {
        func.apply(this, args);
      }, wait);
    };
  }
}