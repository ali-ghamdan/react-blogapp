import axios, { AxiosRequestConfig } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { baseApiURL } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserShortName(name: string) {
  return name[0].toUpperCase() + name.slice(-1)[0].toUpperCase();
}

export async function TC<T>(
  fn: () => Promise<T>
): Promise<[undefined, T] | [any, undefined]> {
  try {
    const data = await fn();
    return [undefined, data];
  } catch (error) {
    return [error, undefined];
  }
}

export async function bRequest<T = any>(
  path: string,
  config: AxiosRequestConfig<T>
) {
  return axios({
    url: `${baseApiURL}${path}`,
    ...config,
  });
}
