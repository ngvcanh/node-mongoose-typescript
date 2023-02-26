declare namespace NodeJS {
  interface ProcessEnv {
    HTTP_ENABLE?: string;
    HTTP_PORT?: string;
    HTTPS_ENABLE?: string;
    HTTPS_PORT?: string;
    HTTPS_SSL_KEY?: string;
    HTTPS_SSL_CERT?: string;
    DB_USERNAME?: string;
    DB_PASSWORD?: string;
    DB_HOST?: string;
    DB_PORT?: string;
    DB_NAME?: string;
    HEADER_MIDDLEWARE?: string;
    APP_PATH?: string;
    APP_DIR?: string;
  }
}

declare module '*' {
  interface EnvParsed {
    HTTP_ENABLE?: boolean;
    HTTP_PORT?: number;
    HTTPS_ENABLE?: boolean;
    HTTPS_PORT?: number;
    HTTPS_SSL_KEY?: string;
    HTTPS_SSL_CERT?: string;
    DB_USERNAME?: string;
    DB_PASSWORD?: string;
    DB_HOST?: string;
    DB_PORT?: string;
    DB_NAME?: string;
    HEADER_MIDDLEWARE: string[];
    IS_PROD: boolean;
    APP_PATH?: string;
    APP_DIR?: string;
    ROOT_DIR: string;
    ROOT_MIDDLEWARE: string;
    APP_DIRECTORY: string;
    APP_MIDDLEWARE: string;
    APP_DIR_CURRENT: string;
  }

  global {
    var ENV: EnvParsed;
  }
}