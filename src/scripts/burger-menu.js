// Burger Menu Functionality
class BurgerMenu {
  constructor() {
    this.burgerButton = document.querySelector('.burger-menu');
    this.mobileNav = document.querySelector('.mobile-nav');
    this.overlay = document.querySelector('.mobile-nav-overlay');
    this.init();
  }

  init() {
    if (this.burgerButton && this.mobileNav && this.overlay) {
      this.burgerButton.addEventListener('click', () => {
        this.toggleMenu();
      });

      // Close menu when clicking on overlay
      this.overlay.addEventListener('click', () => {
        this.closeMenu();
      });

      // Close menu on escape key
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
          this.closeMenu();
        }
      });
    }
  }

  toggleMenu() {
    const isActive = this.mobileNav.classList.contains('active');
    if (isActive) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.burgerButton.classList.add('active');
    this.mobileNav.classList.add('active');
    this.overlay.classList.add('active');
    this.burgerButton.setAttribute('aria-expanded', 'true');
    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';
  }

  closeMenu() {
    this.burgerButton.classList.remove('active');
    this.mobileNav.classList.remove('active');
    this.overlay.classList.remove('active');
    this.burgerButton.setAttribute('aria-expanded', 'false');
    // Restore body scroll
    document.body.style.overflow = '';
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new BurgerMenu();
});
