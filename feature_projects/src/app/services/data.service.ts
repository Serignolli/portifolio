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
        techStack: ['Angular', 'Node.js', 'MongoDB', 'Express', 'Stripe'],
        githubUrl: 'https://github.com/username/ecommerce-platform',
        liveUrl: 'https://ecommerce-demo.com',
        imageUrl: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'client'
      },
      {
        id: 2,
        techStack: ['React', 'TypeScript', 'NestJS', 'PostgreSQL', 'Socket.io'],
        githubUrl: 'https://github.com/username/task-manager',
        liveUrl: 'https://taskmanager-demo.com',
        imageUrl: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'personal'
      },
      {
        id: 3,
        techStack: ['Vue.js', 'Python', 'Django', 'Redis', 'OpenWeather API'],
        githubUrl: 'https://github.com/username/weather-dashboard',
        liveUrl: 'https://weather-demo.com',
        imageUrl: 'https://images.pexels.com/photos/209831/pexels-photo-209831.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'personal'
      },
      {
        id: 4,
        techStack: ['Angular', 'Spring Boot', 'MySQL', 'Chart.js', 'AWS'],
        githubUrl: 'https://github.com/username/social-analytics',
        imageUrl: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'client'
      },
      {
        id: 5,
        techStack: ['Angular', 'NestJS', 'PostgreSQL', 'Docker', 'AWS'],
        githubUrl: 'https://github.com/username/business-management',
        imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'client'
      },
      {
        id: 6,
        techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js'],
        githubUrl: 'https://github.com/username/portfolio-generator',
        liveUrl: 'https://portfolio-gen.com',
        imageUrl: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'personal'
      }
    ];
  }

  getSkills(): SkillCategory[] {
    return [
      {
        category: 'Frontend',
        skills: ['Angular', 'React', 'Vue.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'SCSS']
      },
      {
        category: 'Backend',
        skills: ['Node.js', 'NestJS', 'Express', 'Python', 'Django', 'Spring Boot', 'RESTful APIs']
      },
      {
        category: 'Database',
        skills: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Firebase', 'SQL']
      },
      {
        category: 'DevOps & Tools',
        skills: ['Docker', 'AWS', 'Git', 'CI/CD', 'Linux', 'Nginx', 'Jest', 'Cypress']
      }
    ];
  }
}