import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Translations {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguageSubject = new BehaviorSubject<string>('en');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private translations: { [lang: string]: Translations } = {
    en: {
      // Header
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.projects': 'Projects',
      'nav.skills': 'Skills',
      'nav.contact': 'Contact',
      'theme.light': 'Switch to light mode',
      'theme.dark': 'Switch to dark mode',
      
      // Hero
      'hero.greeting': 'Hi, I\'m John Developer',
      'hero.subtitle': 'Full-Stack Software Developer specializing in modern web technologies and scalable applications',
      'hero.viewWork': 'View My Work',
      'hero.downloadResume': 'Download Resume',
      
      // About
      'about.title': 'About Me',
      'about.subtitle': 'Passionate developer with 5+ years of experience building scalable web applications',
      'about.paragraph1': 'I\'m a dedicated full-stack software developer with a passion for creating innovative web solutions. With over 5 years of experience in the industry, I specialize in modern JavaScript frameworks, cloud technologies, and scalable architecture design.',
      'about.paragraph2': 'My journey began with a Computer Science degree, and I\'ve since worked with startups and established companies, helping them build robust applications that serve millions of users. I\'m constantly learning new technologies and best practices to stay at the forefront of web development.',
      'about.paragraph3': 'When I\'m not coding, you\'ll find me contributing to open-source projects, writing technical blogs, or mentoring junior developers. I believe in the power of technology to solve real-world problems and make a positive impact on people\'s lives.',
      'about.projects': 'Projects Completed',
      'about.experience': 'Years Experience',
      'about.satisfaction': 'Client Satisfaction',
      
      // Projects
      'projects.title': 'Featured Projects',
      'projects.subtitle': 'A showcase of my recent work and technical expertise',
      'projects.backToCategories': '← Back to categories',
      'projects.personal.title': 'Personal Projects',
      'projects.personal.description': 'Projects developed for learning and experimentation with new technologies',
      'projects.client.title': 'Client Projects', 
      'projects.client.description': 'Projects developed for companies and clients with real business impact',
      
      // Individual Projects
      'project.1.title': 'E-Commerce Platform',
      'project.1.description': 'Full-stack e-commerce application with user authentication, product catalog, shopping cart, and payment integration.',
      'project.2.title': 'Task Management App',
      'project.2.description': 'Collaborative task management tool with real-time updates, team collaboration features, and project tracking.',
      'project.3.title': 'Weather Dashboard',
      'project.3.description': 'Modern weather application with location-based forecasts, interactive maps, and detailed analytics.',
      'project.4.title': 'Social Media Analytics',
      'project.4.description': 'Comprehensive analytics platform for social media metrics with data visualization and reporting features.',
      'project.5.title': 'Business Management System',
      'project.5.description': 'Complete management system for small and medium businesses with sales, inventory and financial modules.',
      'project.6.title': 'Portfolio Generator',
      'project.6.description': 'Tool for automatic creation of responsive portfolios with customizable templates.',
      
      // Skills
      'skills.title': 'Technical Skills',
      'skills.subtitle': 'Technologies and tools I work with to build exceptional applications',
      
      // Contact
      'contact.title': 'Get In Touch',
      'contact.subtitle': 'Ready to bring your project to life? Let\'s discuss how we can work together',
      'contact.connect': 'Let\'s Connect',
      'contact.description': 'I\'m always excited to discuss new opportunities and interesting projects. Whether you need a full-stack developer for your team or want to collaborate on a project, I\'d love to hear from you.',
      'contact.form.name': 'Name',
      'contact.form.email': 'Email',
      'contact.form.message': 'Message',
      'contact.form.namePlaceholder': 'Your full name',
      'contact.form.emailPlaceholder': 'your.email@example.com',
      'contact.form.messagePlaceholder': 'Tell me about your project...',
      'contact.form.send': 'Send Message',
      'contact.form.sending': 'Sending...',
      'contact.form.sent': 'Message Sent! ✓',
      'contact.form.nameRequired': 'Name is required',
      'contact.form.nameMinLength': 'Name must be at least 2 characters',
      'contact.form.emailRequired': 'Email is required',
      'contact.form.emailInvalid': 'Please enter a valid email',
      'contact.form.messageRequired': 'Message is required',
      'contact.form.messageMinLength': 'Message must be at least 10 characters',
      
      // Footer
      'footer.tagline': 'Building the future, one line of code at a time.',
      'footer.copyright': 'All rights reserved.'
    },
    'pt-br': {
      // Header
      'nav.home': 'Início',
      'nav.about': 'Sobre',
      'nav.projects': 'Projetos',
      'nav.skills': 'Habilidades',
      'nav.contact': 'Contato',
      'theme.light': 'Mudar para modo claro',
      'theme.dark': 'Mudar para modo escuro',
      
      // Hero
      'hero.greeting': 'Olá, eu sou John Developer',
      'hero.subtitle': 'Desenvolvedor Full-Stack especializado em tecnologias web modernas e aplicações escaláveis',
      'hero.viewWork': 'Ver Meu Trabalho',
      'hero.downloadResume': 'Baixar Currículo',
      
      // About
      'about.title': 'Sobre Mim',
      'about.subtitle': 'Desenvolvedor apaixonado com mais de 5 anos de experiência construindo aplicações web escaláveis',
      'about.paragraph1': 'Sou um desenvolvedor full-stack dedicado com paixão por criar soluções web inovadoras. Com mais de 5 anos de experiência na indústria, me especializo em frameworks JavaScript modernos, tecnologias em nuvem e design de arquitetura escalável.',
      'about.paragraph2': 'Minha jornada começou com um diploma em Ciência da Computação, e desde então trabalhei com startups e empresas estabelecidas, ajudando-as a construir aplicações robustas que servem milhões de usuários. Estou constantemente aprendendo novas tecnologias e melhores práticas para me manter na vanguarda do desenvolvimento web.',
      'about.paragraph3': 'Quando não estou programando, você me encontrará contribuindo para projetos open-source, escrevendo blogs técnicos ou orientando desenvolvedores júnior. Acredito no poder da tecnologia para resolver problemas do mundo real e causar um impacto positivo na vida das pessoas.',
      'about.projects': 'Projetos Concluídos',
      'about.experience': 'Anos de Experiência',
      'about.satisfaction': 'Satisfação do Cliente',
      
      // Projects
      'projects.title': 'Projetos em Destaque',
      'projects.subtitle': 'Uma vitrine do meu trabalho recente e expertise técnica',
      'projects.backToCategories': '← Voltar para categorias',
      'projects.personal.title': 'Projetos Pessoais',
      'projects.personal.description': 'Projetos desenvolvidos para aprendizado e experimentação com novas tecnologias',
      'projects.client.title': 'Projetos para Clientes',
      'projects.client.description': 'Projetos desenvolvidos para empresas e clientes com impacto real nos negócios',
      
      // Individual Projects
      'project.1.title': 'Plataforma E-Commerce',
      'project.1.description': 'Aplicação e-commerce full-stack com autenticação de usuário, catálogo de produtos, carrinho de compras e integração de pagamento.',
      'project.2.title': 'App de Gerenciamento de Tarefas',
      'project.2.description': 'Ferramenta colaborativa de gerenciamento de tarefas com atualizações em tempo real, recursos de colaboração em equipe e rastreamento de projetos.',
      'project.3.title': 'Dashboard do Clima',
      'project.3.description': 'Aplicação moderna de clima com previsões baseadas em localização, mapas interativos e análises detalhadas.',
      'project.4.title': 'Analytics de Redes Sociais',
      'project.4.description': 'Plataforma abrangente de analytics para métricas de redes sociais com visualização de dados e recursos de relatórios.',
      'project.5.title': 'Sistema de Gestão Empresarial',
      'project.5.description': 'Sistema completo de gestão para pequenas e médias empresas com módulos de vendas, estoque e financeiro.',
      'project.6.title': 'Gerador de Portfólio',
      'project.6.description': 'Ferramenta para criação automática de portfólios responsivos com templates personalizáveis.',
      
      // Skills
      'skills.title': 'Habilidades Técnicas',
      'skills.subtitle': 'Tecnologias e ferramentas que uso para construir aplicações excepcionais',
      
      // Contact
      'contact.title': 'Entre em Contato',
      'contact.subtitle': 'Pronto para dar vida ao seu projeto? Vamos discutir como podemos trabalhar juntos',
      'contact.connect': 'Vamos nos Conectar',
      'contact.description': 'Estou sempre animado para discutir novas oportunidades e projetos interessantes. Se você precisa de um desenvolvedor full-stack para sua equipe ou quer colaborar em um projeto, adoraria ouvir de você.',
      'contact.form.name': 'Nome',
      'contact.form.email': 'Email',
      'contact.form.message': 'Mensagem',
      'contact.form.namePlaceholder': 'Seu nome completo',
      'contact.form.emailPlaceholder': 'seu.email@exemplo.com',
      'contact.form.messagePlaceholder': 'Conte-me sobre seu projeto...',
      'contact.form.send': 'Enviar Mensagem',
      'contact.form.sending': 'Enviando...',
      'contact.form.sent': 'Mensagem Enviada! ✓',
      'contact.form.nameRequired': 'Nome é obrigatório',
      'contact.form.nameMinLength': 'Nome deve ter pelo menos 2 caracteres',
      'contact.form.emailRequired': 'Email é obrigatório',
      'contact.form.emailInvalid': 'Por favor, insira um email válido',
      'contact.form.messageRequired': 'Mensagem é obrigatória',
      'contact.form.messageMinLength': 'Mensagem deve ter pelo menos 10 caracteres',
      
      // Footer
      'footer.tagline': 'Construindo o futuro, uma linha de código por vez.',
      'footer.copyright': 'Todos os direitos reservados.'
    }
  };

  constructor() {
    // Check for saved language preference or default to English
    const savedLanguage = localStorage.getItem('language');
    const browserLanguage = navigator.language.toLowerCase();
    
    let defaultLanguage = 'en';
    if (savedLanguage) {
      defaultLanguage = savedLanguage;
    } else if (browserLanguage.startsWith('pt')) {
      defaultLanguage = 'pt-br';
    }
    
    this.setLanguage(defaultLanguage);
  }

  setLanguage(language: string): void {
    this.currentLanguageSubject.next(language);
    localStorage.setItem('language', language);
  }

  toggleLanguage(): void {
    const currentLang = this.currentLanguageSubject.value;
    const newLang = currentLang === 'en' ? 'pt-br' : 'en';
    this.setLanguage(newLang);
  }

  translate(key: string): string {
    const currentLang = this.currentLanguageSubject.value;
    return this.translations[currentLang]?.[key] || key;
  }

  get currentLanguage(): string {
    return this.currentLanguageSubject.value;
  }
}