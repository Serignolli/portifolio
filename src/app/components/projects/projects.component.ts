import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DataService } from '../../services/data.service';
import { Project, ProjectCategory } from '../../models/project.model';
import { TranslationService } from '../../services/translation.service';
import { PrivateRepoModalComponent } from '../private-repo-modal/private-repo-modal.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, PrivateRepoModalComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent implements OnInit {
  projectCategories: ProjectCategory[] = [];
  selectedCategory: string | null = null;
  selectedProjects: Project[] = [];
  showCategories = true;
  modalProject: Project | null = null;

  constructor(
    private dataService: DataService,
    private translationService: TranslationService,
    private cdr: ChangeDetectorRef
  ) {
    this.translationService.currentLanguage$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.cdr.markForCheck());
  }

  ngOnInit() {
    this.projectCategories = this.dataService.getProjectCategories();
  }

  selectCategory(categoryId: string) {
    this.selectedCategory = categoryId;
    this.selectedProjects = this.dataService.getProjectsByCategory(categoryId);
    this.showCategories = false;
  }

  backToCategories() {
    this.showCategories = true;
    this.selectedCategory = null;
    this.selectedProjects = [];
  }

  openPrivateModal(project: Project) {
    this.modalProject = project;
  }

  closeModal() {
    this.modalProject = null;
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }
}
