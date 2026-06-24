export interface Project {
  id: number;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  category: 'personal' | 'client';
  isPrivateRepo?: boolean;
}

export interface ProjectCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  projectCount: number;
}