import {Optional} from '@angular/core';

export interface IValidationErrorInfo {
  message: string;
  members: string[];
}

export interface IErrorInfo {
  code?: number;
  message?: string;
  details?: string;
  msg?: string;
  validationErrors?: IValidationErrorInfo[];
  [key: string]: any;
}

export interface IAjaxResponse {
  success: boolean;
  result?: any;
  targetUrl?: string;
  error?: any;
  unAuthorizedRequest: boolean;
  __abp: boolean;
}

export class CommonInterface {
}
