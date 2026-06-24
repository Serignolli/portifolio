import { Component, HostListener, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThemeService } from '../../services/theme.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  isScrolled = false;
  isDarkMode = false;
  currentLanguage = 'en';

  constructor(
    private themeService: ThemeService,
    private translationService: TranslationService,
    private cdr: ChangeDetectorRef
  ) {
    this.themeService.isDarkMode$
      .pipe(takeUntilDestroyed())
      .subscribe(isDark => {
        this.isDarkMode = isDark;
        this.cdr.markForCheck();
      });

    this.translationService.currentLanguage$
      .pipe(takeUntilDestroyed())
      .subscribe(language => {
        this.currentLanguage = language;
        this.cdr.markForCheck();
      });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 50;
    this.cdr.markForCheck();
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  toggleTheme() {
    this.themeService.toggleDarkMode();
  }

  toggleLanguage() {
    this.translationService.toggleLanguage();
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }
}
