import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { Project, ProjectCategory } from '../../models/project.model';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  projectCategories: ProjectCategory[] = [];
  selectedCategory: string | null = null;
  selectedProjects: Project[] = [];
  showCategories = true;

  constructor(
    private dataService: DataService,
    private translationService: TranslationService
  ) {}

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

  translate(key: string): string {
    return this.translationService.translate(key);
  }
}