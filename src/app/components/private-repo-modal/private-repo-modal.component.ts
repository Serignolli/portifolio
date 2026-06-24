import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslationService } from '../../services/translation.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-private-repo-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './private-repo-modal.component.html',
  styleUrls: ['./private-repo-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivateRepoModalComponent implements OnInit, OnDestroy {
  @Input() project!: Project;
  @Output() closed = new EventEmitter<void>();

  countdown = 5;
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private translationService: TranslationService,
    private cdr: ChangeDetectorRef
  ) {
    this.translationService.currentLanguage$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.cdr.markForCheck());
  }

  ngOnInit() {
    this.timer = setInterval(() => {
      this.countdown--;
      this.cdr.markForCheck();
      if (this.countdown <= 0) {
        this.redirect();
      }
    }, 1000);
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  redirect() {
    this.clearTimer();
    if (this.project.liveUrl) {
      window.open(this.project.liveUrl, '_blank', 'noopener,noreferrer');
    }
    this.closed.emit();
  }

  close() {
    this.clearTimer();
    this.closed.emit();
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  private clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
