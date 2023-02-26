import dotenv from 'dotenv';
import path from 'path';

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

dotenv.config();

const toBool = (key: keyof NodeJS.ProcessEnv) => {
  return (
    process.env[key] !== undefined &&
    process.env[key].toLowerCase() !== 'false'
  );
}

const toInt = (key: keyof NodeJS.ProcessEnv) => {
  if (process.env[key] !== undefined) {
    return parseInt(process.env[key])
  }

  return undefined;
}

const toArr = (key: keyof NodeJS.ProcessEnv) => {
  if (process.env[key] === undefined) {
    return [];
  }

  return process.env[key].split(',').map(v => v.trim())
}

const ROOT_DIR = path.resolve(__dirname, '..');
const ROOT_MIDDLEWARE = path.resolve(ROOT_DIR, 'middlewares');
const APP_DIRECTORY = path.resolve(ROOT_DIR, 'apps');
const APP_DIR_CURRENT = path.resolve(APP_DIRECTORY, process.env.APP_DIR)

const ENV: EnvParsed = {
  ...process.env,
  HTTP_ENABLE: toBool('HTTP_ENABLE'),
  HTTP_PORT: toInt('HTTP_PORT'),
  HTTPS_ENABLE: toBool('HTTPS_ENABLE'),
  HTTPS_PORT: toInt('HTTPS_PORT'),
  HEADER_MIDDLEWARE: toArr('HEADER_MIDDLEWARE'),
  IS_PROD: process.env.NODE_ENV === 'production',
  ROOT_DIR,
  ROOT_MIDDLEWARE,
  APP_DIRECTORY,
  APP_DIR_CURRENT,
  APP_MIDDLEWARE: path.resolve(APP_DIR_CURRENT, 'middlewares')
}

global.ENV = ENV;