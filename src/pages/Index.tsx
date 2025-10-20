import { PortfolioPage, PortfolioPageProps } from "@/components/ui/starfall-portfolio-landing";

const Index = () => {
  const portfolioData: PortfolioPageProps = {
    logo: {
      initials: 'xo',
      name: 'xo1o',
    },
    navLinks: [
      { label: 'About', href: '#about' },
      { label: 'Games', href: '#games' },
      { label: 'Past Work', href: '#pastwork' },
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
        onClick: () => { document.getElementById('games')?.scrollIntoView({ behavior: 'smooth' }); },
      },
      secondary: {
        label: 'Get In Touch',
        onClick: () => { document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); },
      },
    },
    games: [
      { 
        title: 'Game System', 
        description: 'Advanced monetization and progression systems for high-retention gameplay.',
        tags: ['Lua', 'Roblox Studio', 'DataStore'],
        mediaType: 'youtube',
        mediaUrl: 'dQw4w9WgXcQ',
        externalLink: 'https://www.roblox.com/games/12345/Example-Game',
      },
      { 
        title: 'Combat Framework', 
        description: 'Smooth and responsive combat system with hit detection and animations.',
        tags: ['Lua', 'RemoteEvents', 'Animation'],
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
        externalLink: 'https://www.roblox.com/games/67890/Combat-Demo',
      },
      { 
        title: 'UI Systems', 
        description: 'Intuitive and polished user interfaces for seamless player experience.',
        tags: ['Lua', 'Roact', 'Spring Animation'],
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400',
        externalLink: 'https://www.youtube.com/watch?v=example',
      },
      { 
        title: 'Shop System', 
        description: 'Complete shop system with inventory management and purchase verification.',
        tags: ['Lua', 'DataStore', 'UI'],
        mediaType: 'youtube',
        mediaUrl: 'dQw4w9WgXcQ',
        externalLink: 'https://www.roblox.com/games/11111/Shop-System',
      },
    ],
    pastWork: [
      { 
        title: 'Anti-Cheat Module', 
        description: 'Server-side anti-cheat detecting exploits and suspicious behavior.',
        tags: ['Lua', 'Security', 'RemoteEvents'],
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400',
        externalLink: 'https://www.roblox.com/games/22222/Secure-Game',
      },
      { 
        title: 'Admin Commands', 
        description: 'Comprehensive admin panel with moderation tools and logging.',
        tags: ['Lua', 'UI', 'Commands'],
        mediaType: 'youtube',
        mediaUrl: 'dQw4w9WgXcQ',
        externalLink: 'https://www.roblox.com/games/33333/Admin-Demo',
      },
      { 
        title: 'Pet System', 
        description: 'Collectible pet system with trading and breeding mechanics.',
        tags: ['Lua', 'DataStore', 'Animation'],
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400',
        externalLink: 'https://www.roblox.com/games/44444/Pet-Game',
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
