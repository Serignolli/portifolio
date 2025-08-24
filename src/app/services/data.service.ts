import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';
import { SkillCategory } from '../models/skill.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  getProjects(): Project[] {
    return [
      {
        id: 1,
        title: 'E-Commerce Platform',
        description: 'Full-stack e-commerce application with user authentication, product catalog, shopping cart, and payment integration.',
        techStack: ['Angular', 'Node.js', 'MongoDB', 'Express', 'Stripe'],
        githubUrl: 'https://github.com/username/ecommerce-platform',
        liveUrl: 'https://ecommerce-demo.com',
        imageUrl: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        id: 2,
        title: 'Task Management App',
        description: 'Collaborative task management tool with real-time updates, team collaboration features, and project tracking.',
        techStack: ['React', 'TypeScript', 'NestJS', 'PostgreSQL', 'Socket.io'],
        githubUrl: 'https://github.com/username/task-manager',
        liveUrl: 'https://taskmanager-demo.com',
        imageUrl: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        id: 3,
        title: 'Weather Dashboard',
        description: 'Modern weather application with location-based forecasts, interactive maps, and detailed analytics.',
        techStack: ['Vue.js', 'Python', 'Django', 'Redis', 'OpenWeather API'],
        githubUrl: 'https://github.com/username/weather-dashboard',
        liveUrl: 'https://weather-demo.com',
        imageUrl: 'https://images.pexels.com/photos/209831/pexels-photo-209831.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        id: 4,
        title: 'Social Media Analytics',
        description: 'Comprehensive analytics platform for social media metrics with data visualization and reporting features.',
        techStack: ['Angular', 'Spring Boot', 'MySQL', 'Chart.js', 'AWS'],
        githubUrl: 'https://github.com/username/social-analytics',
        imageUrl: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=600'
      }
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
        skills: ['Java', 'Spring Boot', 'Micronaut', 'Kafka', 'Python', 'RESTful APIs']
      },
      {
        category: 'Database',
        skills: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Firebase', 'SQL']
      },
      {
        category: 'DevOps & Tools',
        skills: ['Docker', 'AWS', 'Git', 'CI/CD', 'Linux', 'Nginx', 'Junit', 'Mockito']
      }
    ];
  }
}