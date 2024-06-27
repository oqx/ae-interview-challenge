import { isObject } from "./object";
import type { ApiError } from "@ae/types";

export const isApiError = (arg: unknown): arg is ApiError =>
  isObject(arg) && "error" in arg && "message" in arg;

export const isApiErrors = (arg: unknown): arg is ApiError[] =>
  Array.isArray(arg) && arg.length > 0 && isApiError(arg[0]);

export const isApiErrorsObject = (
  arg: unknown
): arg is { errors: ApiError[] } =>
  isObject(arg) && "errors" in arg && isApiErrors(arg.errors);
