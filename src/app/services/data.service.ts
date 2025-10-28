import { Injectable } from '@angular/core';
import { Project, ProjectCategory } from '../models/project.model';
import { SkillCategory } from '../models/skill.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  getProjectCategories(): ProjectCategory[] {
    const projects = this.getProjects();
    return [
      {
        id: 'personal',
        name: 'Personal Projects',
        description: 'Projects developed for learning and experimentation',
        icon: '💡',
        projectCount: projects.filter(p => p.category === 'personal').length
      },
      {
        id: 'client',
        name: 'Client Projects',
        description: 'Projects developed for companies and clients',
        icon: '🏢',
        projectCount: projects.filter(p => p.category === 'client').length
      }
    ];
  }

  getProjectsByCategory(categoryId: string): Project[] {
    return this.getProjects().filter(project => project.category === categoryId);
  }

  getProjects(): Project[] {
    return [
      {
        id: 1,
        techStack: ['React.js', 'Lucide React', 'TailwindCSS'],
        githubUrl: 'Projeto privado - criar página de redirecionamento',
        liveUrl: 'https://hand-solve.vercel.app/',
        imageUrl: '/assets/projects/costumer/handsolve.png',
        category: 'client'
      },
      {
        id: 2,
        techStack: ['Python', 'Gradio', 'OpenRouter API'],
        githubUrl: 'https://github.com/Serignolli/Gradio_OpenRouter',
        liveUrl: 'https://ai-code-reviewer-and-explainer.onrender.com/',
        imageUrl: '/assets/projects/personal/AiCodeReviewer.png',
        category: 'personal'
      },
      {
        id: 3,
        techStack: ['React.js', 'Typescript', 'TailwindCSS', 'Vite'],
        githubUrl: 'https://github.com/Serignolli/ritual-esquecimento',
        liveUrl: 'https://ritual-esquecimento.vercel.app/',
        imageUrl: '/assets/projects/personal/RitualForgetting.png',
        category: 'personal'
      },
      {
        id: 4,
        techStack: ['React.js', 'Typescript', 'TailwindCSS'],
        githubUrl: 'https://github.com/Serignolli/bike_calculator',
        liveUrl: 'https://bike-calculator-pied.vercel.app/',
        imageUrl: '/assets/projects/personal/PedalCalculator.png',
        category: 'personal'
      },
    ];
  }

  getSkills(): SkillCategory[] {
    return [
      {
        category: 'Frontend',
        skills: ['Angular', 'React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'SCSS']
      },
      {
        category: 'Backend',
        skills: ['Java', 'Spring Boot', 'Micronaut', 'Python', 'RESTful APIs']
      },
      {
        category: 'Database',
        skills: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Firebase', 'SQL']
      },
      {
        category: 'DevOps & Tools',
        skills: ['Docker', 'AWS', 'Git', 'CI/CD', 'Linux', 'Nginx', 'Kafka']
      }
    ];
  }
}
