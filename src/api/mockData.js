export const mockData = {
  teamMembers: [
    {
      id: 'patrick-hendron',
      name: 'Patrick Hendron',
      title: 'Senior QA Engineer',
      email: 'patrick.hendron@ensono.com',
      location: 'Belfast, UK',
      bio: 'Passionate QA Engineer with 8+ years of experience in test automation, performance testing, and quality assurance. Specializes in building robust testing frameworks and implementing CI/CD best practices.',
      skills: [
        'Test Automation',
        'Playwright',
        'Selenium',
        'API Testing',
        'Performance Testing',
        'CI/CD',
        'TypeScript',
        'Python',
        'Docker',
        'Kubernetes',
      ],
      projects: [
        {
          name: 'E-commerce Platform Testing',
          role: 'Lead QA Engineer',
          description:
            'Led comprehensive testing strategy for a multi-million pound e-commerce platform, implementing automated testing across web, mobile, and API layers.',
          technologies: ['Playwright', 'TypeScript', 'Docker', 'Jenkins'],
          duration: '12 months',
        },
        {
          name: 'Banking API Automation',
          role: 'Senior QA Engineer',
          description:
            'Developed and maintained automated test suites for critical banking APIs, ensuring 99.9% uptime and regulatory compliance.',
          technologies: ['REST Assured', 'Java', 'TestNG', 'Maven'],
          duration: '8 months',
        },
        {
          name: 'Mobile App Quality Framework',
          role: 'QA Architect',
          description:
            'Designed and implemented quality framework for iOS and Android applications, reducing regression testing time by 75%.',
          technologies: ['Appium', 'WebDriverIO', 'Sauce Labs', 'Firebase'],
          duration: '6 months',
        },
      ],
      avatar: '/images/default-avatar.svg',
    },
    {
      id: 'tom-moor',
      name: 'Tom Moor',
      title: 'Principal DevOps Engineer',
      email: 'tom.moor@ensono.com',
      location: 'Manchester, UK',
      bio: 'Experienced DevOps Engineer with 10+ years in cloud infrastructure, automation, and scalable system design. Expert in AWS, Azure, and Google Cloud Platform with a focus on reliability and performance.',
      skills: [
        'DevOps',
        'AWS',
        'Azure',
        'Terraform',
        'Kubernetes',
        'Docker',
        'Python',
        'Go',
        'Monitoring',
        'Infrastructure as Code',
      ],
      projects: [
        {
          name: 'Cloud Migration Project',
          role: 'Lead DevOps Engineer',
          description:
            'Successfully migrated legacy infrastructure to AWS, reducing operational costs by 40% and improving system reliability to 99.95% uptime.',
          technologies: ['AWS', 'Terraform', 'Docker', 'Kubernetes'],
          duration: '18 months',
        },
        {
          name: 'CI/CD Pipeline Optimization',
          role: 'Principal DevOps Engineer',
          description:
            'Redesigned CI/CD pipelines for 50+ microservices, reducing deployment time from hours to minutes while improving reliability.',
          technologies: ['Jenkins', 'GitLab CI', 'ArgoCD', 'Helm'],
          duration: '10 months',
        },
        {
          name: 'Monitoring & Observability Platform',
          role: 'DevOps Architect',
          description:
            'Built comprehensive monitoring solution providing real-time insights across 200+ services, improving incident response time by 60%.',
          technologies: ['Prometheus', 'Grafana', 'ELK Stack', 'Jaeger'],
          duration: '12 months',
        },
      ],
      avatar: '/images/default-avatar.svg',
    },
  ],
};
