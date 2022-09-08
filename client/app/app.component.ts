import { Component, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'spendit';

  // Click listener to make tap on mobile device work a bit better
  @HostListener('click', ['$event.target'])
  click(target: HTMLElement) {
    if (!target.classList.value.includes('btn')) {
      // If it does not include btn as class, there is chance it is child of button
      const potentialBtn = target.closest('.btn');
      if (potentialBtn !== null) {
        target = potentialBtn as HTMLElement;
      } else {
        // no parent btn so we do not care
        return;
      }
    }
    const oldClass = target.className;
    target.className = `${oldClass} tap`;
    setTimeout(() => {
      target.className = oldClass;
    }, 100);
  }
}
