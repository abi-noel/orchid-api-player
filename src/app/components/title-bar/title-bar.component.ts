import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrl: './title-bar.component.css',
})
export class TitleBarComponent {
  isHidden = false; // Track navbar visibility
  lastScrollTop = 0; // Track last scroll position
  navbarHeight = 60; // Threshold of pixels to ignore before hiding (jut the navbar pixel height)

  /*
  Logic for hiding title bar on scroll down and revealing it on
  scroll up
  */
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScrollTop =
      window.scrollY || document.documentElement.scrollTop; // depends on the browser?

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

    /*
    ChatGPT told me to do this, I don't fully understand it
    I think it's for handling the case where a user scrolls on mobile
    and the screen sort of "bounces" at the bottom, like it's being
    pulled on a rubber band and then snapping back.
    This line handles the case where the scroll position is negative, 
    and reassigns it to zero.
    */
    this.lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // For Mobile or negative scrolling
  }
}
