import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor() {}

  export(data: any, name: string) {
    const array = [Object.keys(data[0])].concat(data);
    const csv = array
      .map((it: Array<Object>) => {
        // console.log(Object.values(it));
        let it2 = Object.values(it).map((el: any) => {
          if (Array.isArray(el)) {
            el = el.map((el2)=>{
              // console.log(el2);
              return Object.values(el2);
            });
            return el;
          } else {
            return el;
          }
        });
        return it2.join('\t');
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
}
