import { Component, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConfigService } from './_services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  brand = {
        name: "spendit",
        shortName: "spdt",
        email: "email",
        primaryColor: "000000",
        secondaryColor: "000000",
        logo: "logo"
    };
  title = 'spendit';

  constructor(private appConfigService: AppConfigService){
    if (appConfigService.branding) {
      this.brand = appConfigService.branding;
    }
  }

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
