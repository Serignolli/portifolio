import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { SkillCategory } from '../../models/skill.model';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
  skillCategories: SkillCategory[] = [];

  constructor(
    private dataService: DataService,
    private translationService: TranslationService
  ) {}

  ngOnInit() {
    this.skillCategories = this.dataService.getSkills();
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }
}