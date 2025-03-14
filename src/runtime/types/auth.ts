export interface AuthData {
  email?: string,
  password?: string,
  [key: string]: any
}

type ConvertToType<T> = T extends "string"
  ? string
  : T extends "number"
  ? number
  : T extends "boolean"
  ? boolean
  : T extends "string | number"
  ? string | number
  : unknown;

export type ExtractConfig<T extends Record<string, any>> = {
  [K in keyof T]: ConvertToType<T[K]>;
};