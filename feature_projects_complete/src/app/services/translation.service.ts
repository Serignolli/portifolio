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
      'hero.greeting': 'Hi, I\'m Gabriel Moreno Serignolli',
      'hero.subtitle': 'Full-Stack Developer focused on back-end, microservices, and performance-driven solutions',
      'hero.viewWork': 'View My Work',
      'hero.downloadResume': 'Download Resume',

      // About
      'about.title': 'About Me',
      'about.subtitle': 'Developer constantly learning and evolving in the back-end world',
      'about.paragraph1': 'I currently work as a back-end developer at Autbank, a consultancy for financial institutions. I develop payroll loan microservices using Java, Spring, Micronaut, Kafka, Redis, and SQL Server.',
      'about.paragraph2': 'I have a degree in Systems Analysis and Development and started my career working on an ERP built with Java Swing. In my personal projects, I also work with Angular, TypeScript, HTML, and SCSS.',
      'about.paragraph3': 'Driven by curiosity, I enjoy learning, teaching, and exploring new technologies. I once taught programming and truly enjoyed the experience. I’m always looking to improve as a developer and as a person.',
      'about.projects': 'Projects Completed',
      'about.experience': 'Years of Experience',
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
      'project.1.title': 'Hand Solve Landing Page',
      'project.1.description': 'Responsive page showcasing a degreaser product line, featuring animated carousel, informative sections, and WhatsApp integration.',
      'project.2.title': 'OpenRouter AI Chat – Code Reviewer',
      'project.2.description': 'Python chatbot with Gradio, integrated with the OpenRouter API, specialized in reviewing code and suggesting improvements.',
      'project.3.title': 'Ritual of Forgetting',
      'project.3.description': 'Interactive web app that simulates a digital ritual for letting go of memories, featuring symbolic animations and a mystical responsive design.',
      'project.4.title': 'Pedal Calculator',
      'project.4.description': 'Web app that measures environmental, financial, and energy impact when replacing cars with bikes, featuring interactive comparisons and a responsive design.',
      
      // Skills
      'skills.title': 'Technical Skills',
      'skills.subtitle': 'Technologies I use to build robust and scalable applications',

      // Contact
      'contact.title': 'Get In Touch',
      'contact.subtitle': 'Let’s talk about how I can help your project succeed',
      'contact.connect': 'Let’s Connect',
      'contact.description': 'I’m open to new challenges and collaborations. If you’re looking for someone with strong back-end foundations and curiosity to grow, feel free to reach out.',
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
      'footer.tagline': 'Code with clarity. Learn with curiosity.',
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
      'hero.greeting': 'Olá, eu sou Gabriel Moreno Serignolli',
      'hero.subtitle': 'Desenvolvedor Full-Stack com foco em back-end, microsserviços e soluções com boa performance',
      'hero.viewWork': 'Ver Meu Trabalho',
      'hero.downloadResume': 'Baixar Currículo',

      // About
      'about.title': 'Sobre Mim',
      'about.subtitle': 'Desenvolvedor em constante aprendizado no mundo do back-end',
      'about.paragraph1': 'Atualmente sou desenvolvedor back-end na Autbank, consultoria que atende instituições financeiras. Trabalho com microsserviços para crédito consignado usando Java, Spring, Micronaut, Kafka, Redis e SQL Server.',
      'about.paragraph2': 'Sou formado em Análise e Desenvolvimento de Sistemas e comecei minha carreira trabalhando em um ERP legado com Java Swing. Em projetos pessoais também utilizo Angular, TypeScript, HTML e SCSS.',
      'about.paragraph3': 'Sou movido pela curiosidade. Gosto de aprender, ensinar e explorar novas tecnologias. Já dei aula de programação e foi uma experiência muito positiva. Estou sempre buscando evoluir como desenvolvedor e como pessoa.',
      'about.projects': 'Projetos Concluídos',
      'about.experience': 'Anos de Experiência',
      'about.satisfaction': 'Satisfação dos Clientes',
      
      // Projects
      'projects.title': 'Projetos em Destaque',
      'projects.subtitle': 'Uma vitrine do meu trabalho recente e expertise técnica',
      'projects.backToCategories': '← Voltar para categorias',
      'projects.personal.title': 'Projetos Pessoais',
      'projects.personal.description': 'Projetos desenvolvidos para aprendizado e experimentação com novas tecnologias',
      'projects.client.title': 'Projetos para Clientes',
      'projects.client.description': 'Projetos desenvolvidos para empresas e clientes com impacto real nos negócios',
      
      // Individual Projects
      'project.1.title': 'Landing Page Hand Solve',
      'project.1.description': 'Página responsiva para apresentação de linha de produtos de desengraxantes, com carrossel animado, seções explicativas e integração com WhatsApp.',
      'project.2.title': 'OpenRouter AI Chat – Code Reviewer',
      'project.2.description': 'Chatbot em Python com Gradio, integrado à API do OpenRouter, especializado em revisar código e sugerir melhorias.',
      'project.3.title': 'Ritual de Esquecimento',
      'project.3.description': 'Aplicação web interativa que simula um ritual digital para esquecer memórias, com animações simbólicas e design místico responsivo.',
      'project.4.title': 'Calculadora do Pedal',
      'project.4.description': 'Aplicação web que calcula impacto ambiental, financeiro e energético ao substituir o carro pela bicicleta, com comparativos interativos e design responsivo.',
      
      // Skills
      'skills.title': 'Habilidades Técnicas',
      'skills.subtitle': 'Tecnologias que utilizo para construir aplicações robustas e escaláveis',

      // Contact
      'contact.title': 'Entre em Contato',
      'contact.subtitle': 'Vamos conversar sobre como posso ajudar seu projeto a ter sucesso',
      'contact.connect': 'Vamos nos Conectar',
      'contact.description': 'Estou aberto a novos desafios e colaborações. Se você busca alguém com boa base em back-end e vontade de evoluir, entre em contato.',
      'contact.form.name': 'Nome',
      'contact.form.email': 'Email',
      'contact.form.message': 'Mensagem',
      'contact.form.namePlaceholder': 'Seu nome completo',
      'contact.form.emailPlaceholder': 'seu.email@exemplo.com',
      'contact.form.messagePlaceholder': 'Conte sobre seu projeto...',
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
      'footer.tagline': 'Código com clareza. Aprendizado com curiosidade.',
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