import { PortfolioPage, PortfolioPageProps } from "@/components/ui/starfall-portfolio-landing";

const Index = () => {
  const portfolioData: PortfolioPageProps = {
    logo: {
      initials: 'xo',
      name: 'xo1o',
    },
    navLinks: [
      { label: 'About', href: '#about' },
      { label: 'Projects', href: '#projects' },
      { label: 'Skills', href: '#skills' },
    ],
    resume: {
      label: 'Resume',
      onClick: () => window.open('#', '_blank'),
    },
    hero: {
      titleLine1: 'Professional Roblox Scripter &',
      titleLine2Gradient: 'Game Developer',
      subtitle: "I'm xo1o, a professional Roblox scripter who specializes in simple, efficient Lua systems. I've been making dependable, well-optimized, and engagement-focused games for 3+ years.",
    },
    ctaButtons: {
      primary: {
        label: 'View My Work',
        onClick: () => { document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); },
      },
      secondary: {
        label: 'Get In Touch',
        onClick: () => { document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); },
      },
    },
    projects: [
      { 
        title: 'Game System', 
        description: 'Advanced monetization and progression systems for high-retention gameplay.',
        tags: ['Lua', 'Roblox Studio', 'DataStore'] 
      },
      { 
        title: 'Combat Framework', 
        description: 'Smooth and responsive combat system with hit detection and animations.',
        tags: ['Lua', 'RemoteEvents', 'Animation'] 
      },
      { 
        title: 'UI Systems', 
        description: 'Intuitive and polished user interfaces for seamless player experience.',
        tags: ['Lua', 'Roact', 'Spring Animation'] 
      },
    ],
    stats: [
      { value: '3+', label: 'Years Experience' },
      { value: '50+', label: 'Projects Completed' },
      { value: '100K+', label: 'Players Reached' },
    ],
    showAnimatedBackground: true,
  };

  return <PortfolioPage {...portfolioData} />;
};

export default Index;
