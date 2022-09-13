import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor() {}

  export(data: any, name: string) {
    // Create table header from key names
    const array = [Object.keys(data[0])].concat(data);
    // console.log(array);

    // Parse object array
    const csv = array
      .map((array_item: Array<Object>) => {
        // console.log(array_item);
        // console.log(Object.values(row_item));
        // Convert array item to CSV row item
        // Basically just creating an array of the values
        const row_item = Object.values(array_item).map(
          (array_item_element: any) => {
            // Concat nested arrays so they are one cell
            if (Array.isArray(array_item_element)) {
              return array_item_element
                .map((nested_array_element) => {
                  // console.log(nested_array_element);
                  return Object.values(nested_array_element).join(', ');
                })
                .join('; ');
            } else {
              return array_item_element;
            }
          }
        );
        return row_item.join('\t');
      })
      .join('\n');
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(csv)
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
  isBoolean(variable: any): boolean{
    return typeof variable === 'boolean';
  }
  isString(variable: any): boolean{
    return typeof variable === 'string';

  }
  isNumber(variable: any): boolean{
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
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
  }
}
