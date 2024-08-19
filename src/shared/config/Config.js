export default class Config {
  static APP_VERSION = __app_version;
  static APP_DESCRIPTION = __app_description;
  static DEBUG_MODE = (process.env.NODE_ENV === 'development');
}