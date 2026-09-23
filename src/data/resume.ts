import type { Localized } from './projects';

/**
 * Conteúdo da página /curriculo, o lado "quem é o Gabriel" do site.
 *
 * Veio do portfólio antigo, menos os projetos: esses moram na página principal.
 */

/** Mesmo caminho do portfólio antigo, pra links já espalhados continuarem valendo. */
export const RESUME_PDF = '/assets/resume/Curriculo_Gabriel_Serignolli.pdf';

/** Ano em que a carreira começou, base do "anos de experiência". */
export const CAREER_START = 2023;

export type SkillGroup = { category: Localized; skills: string[] };

export const skills: SkillGroup[] = [
  {
    category: { pt: 'Frontend', en: 'Frontend' },
    skills: ['Angular', 'React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'SCSS'],
  },
  {
    category: { pt: 'Backend', en: 'Backend' },
    skills: ['Java', 'Spring Boot', 'Micronaut', 'Python', 'RESTful APIs', 'JUnit', 'Mockito'],
  },
  {
    category: { pt: 'Banco de dados', en: 'Database' },
    skills: ['PostgreSQL', 'SQL Server', 'MySQL', 'MongoDB', 'Redis', 'Firebase'],
  },
  {
    category: { pt: 'DevOps e ferramentas', en: 'DevOps & Tools' },
    skills: ['Azure', 'AWS', 'Docker', 'Kubernetes', 'Kafka', 'Grafana', 'Git', 'CI/CD', 'Linux', 'Nginx'],
  },
];

export const resumeContent = {
  header: {
    fullName: 'Gabriel Moreno Serignolli',
    greeting: { pt: 'Olá, eu sou', en: "Hi, I'm" },
    subtitle: {
      pt: 'Desenvolvedor Java full stack. Back-end sólido com Spring, front-end em Angular e React, e automação pra tirar o trabalho repetitivo do caminho.',
      en: 'Java full stack developer. Solid back ends with Spring, front ends in Angular and React, and automation to get repetitive work out of the way.',
    },
    viewWork: { pt: 'Ver meus projetos', en: 'See my projects' },
    download: { pt: 'Baixar currículo (PDF)', en: 'Download résumé (PDF)' },
  },

  nav: {
    home: { pt: 'Início', en: 'Home' },
    about: { pt: 'Sobre mim', en: 'About me' },
    skills: { pt: 'Habilidades', en: 'Skills' },
    contact: { pt: 'Contato', en: 'Contact' },
  },

  about: {
    heading: { pt: 'Sobre mim', en: 'About me' },
    subtitle: {
      pt: 'Gosto de pegar processo lento e manual e transformar em sistema rápido.',
      en: 'I like taking slow, manual processes and turning them into fast systems.',
    },
    paragraphs: [
      {
        pt: 'Hoje sou desenvolvedor Java na 7COMM, atuando de ponta a ponta: Spring Boot no back-end, Angular no front-end, APIs REST, PostgreSQL e serviços da Azure como Service Bus e Communication Services, incluindo deploy na nuvem.',
        en: 'I currently work as a Java developer at 7COMM, end to end: Spring Boot on the back end, Angular on the front end, REST APIs, PostgreSQL and Azure services such as Service Bus and Communication Services, deployments included.',
      },
      {
        pt: 'Antes, na Autbank, construí microsserviços para o setor financeiro com Spring Boot, Micronaut e Kafka, usando padrões como SAGA para transações distribuídas. Na Strategix, desenvolvi sistemas de ERP, CRM e BI em Java e SQL Server: integrei boletos ao PIX, derrubando a validação de 2 dias para 15 minutos, e automatizei em Python rotinas que levavam 40 horas e passaram a levar 10.',
        en: 'Before that, at Autbank, I built microservices for the financial sector with Spring Boot, Micronaut and Kafka, using patterns like SAGA for distributed transactions. At Strategix, I developed ERP, CRM and BI systems in Java and SQL Server: I integrated bank slips with PIX, cutting validation from 2 days to 15 minutes, and automated in Python routines that took 40 hours down to 10.',
      },
      {
        pt: 'Sou formado em Análise e Desenvolvimento de Sistemas pelo Senac, com pós-graduação em Engenharia de Software e em Cibersegurança, e antes disso fiz técnico em Mecatrônica. Falo inglês em nível avançado.',
        en: "I have a degree in Systems Analysis and Development from Senac, with postgraduate studies in Software Engineering and in Cybersecurity, and before that a technical course in Mechatronics. I speak advanced English.",
      },
      {
        pt: 'Fora do trabalho, sigo movido pela curiosidade: gosto de aprender, ensinar (já dei aula de programação e adorei) e de construir as ferramentas e os jogos que estão na página de projetos.',
        en: "Outside work, curiosity still drives me: I like learning, teaching (I've taught programming and loved it) and building the tools and games you'll find on the projects page.",
      },
    ] satisfies Localized[],
    experience: { pt: 'anos de experiência', en: 'years of experience' },
  },

  skills: {
    heading: { pt: 'Habilidades técnicas', en: 'Technical skills' },
    subtitle: {
      pt: 'Tecnologias que utilizo para construir aplicações robustas e escaláveis.',
      en: 'Technologies I use to build robust and scalable applications.',
    },
  },

  contact: {
    heading: { pt: 'Vamos nos conectar', en: "Let's connect" },
    text: {
      pt: 'Estou aberto a novos desafios e colaborações. Se você busca alguém com boa base em back-end e vontade de evoluir, entre em contato.',
      en: "I'm open to new challenges and collaborations. If you're looking for someone with strong back-end foundations and curiosity to grow, feel free to reach out.",
    },
  },

  /** Ponte de volta para o lado de serviços do site. */
  cta: {
    heading: { pt: 'Precisa de um sistema?', en: 'Need a system built?' },
    text: {
      pt: 'Além do trabalho fixo, eu desenvolvo sob encomenda: da interface ao servidor e à publicação.',
      en: 'Besides my full-time job, I build custom systems: from the interface to the server and deployment.',
    },
    action: { pt: 'Ver trabalho sob encomenda', en: 'See custom work' },
  },
} as const;
