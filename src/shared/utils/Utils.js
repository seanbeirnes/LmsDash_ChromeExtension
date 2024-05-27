export class Utils
{
  static async sleep(time)
  {
    return new Promise((resolve) =>
    {
      setTimeout(resolve, time)
    })
  }
}