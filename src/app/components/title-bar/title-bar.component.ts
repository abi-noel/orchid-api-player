import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrl: './title-bar.component.css',
})
export class TitleBarComponent {
  isHidden = false; // Track navbar visibility
  lastScrollTop = 0; // Track last scroll position
  navbarHeight = 80; // Threshold of pixels to ignore before hiding (jut the navbar pixel height)

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScrollTop =
      window.scrollY || document.documentElement.scrollTop;

    if (
      currentScrollTop > this.lastScrollTop &&
      currentScrollTop > this.navbarHeight
    ) {
      // Scrolling down
      this.isHidden = true;
    } else {
      // Scrolling up
      this.isHidden = false;
    }

    this.lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // For Mobile or negative scrolling
  }
}
