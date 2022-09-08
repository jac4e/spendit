import { Component, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'spendit';

  @HostListener('click', ['$event.target'])
  click(target: HTMLElement) {
    const oldClass = target.className;
    if (oldClass.includes('btn')){
      target.className = `${oldClass} tap`;
      console.log(target.className);
      setTimeout(() => {
        target.className = oldClass;
        console.log(target.className);
      }, 100);
    }
  }
}
