import { ReturnStatement } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { getKeys, IRefill, IAccount, IProduct, getValues, ITransaction } from 'typesit';
import { AllowableListData } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor() {}

  export(data: AllowableListData[], name: string) {
    // Check if data to export is empty
    if (data.length < 1) {
      return;
    }
    const csvString = [
      getKeys(data[0]).map((key) => key[0].toUpperCase() + key.slice(1)),
      ...data.map((item) => {
        return getValues(item).map((value) => {
          // serialize nested arrays
          // console.log(value, Array.isArray(value));
          if (Array.isArray(value)) {
            return JSON.stringify(value)
              .replace(/,/gm, ';')
              .replace(/(\r\n|\n|\r)/gm, '');
          }
          // remove commas and newlines from strings
          if (typeof value === 'string') {
            return value.replace(/,/gm, ';').replace(/(\r\n|\n|\r)/gm, '');
          }
          return value;
        });
      })
    ]
      .map((e) => e.join(','))
      .join('\n');
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(csvString)
    );
    element.setAttribute('download', name);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
  localeISOTime() {
    const date = new Date(Date.now());
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}T${
      date.toTimeString().replace(/:/g, '').replace(' GMT', '').split(' (')[0]
    }`;
  }
  isBoolean(variable: any): boolean {
    return typeof variable === 'boolean';
  }
  isString(variable: any): boolean {
    return typeof variable === 'string';
  }
  isNumber(variable: any): boolean {
    return typeof variable === 'number';
  }
  isArray(obj: any) {
    return Array.isArray(obj);
  }
  isObject(A: any) {
    return typeof A === 'object';
  }
  getProperties(obj: any) {
    return Object.getOwnPropertyNames(obj);
  }
  titleCase(string: string) {
    const result = string.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
    // return string[0].toUpperCase() + string.slice(1).toLowerCase();
  }
}
