import { PortfolioPage, PortfolioPageProps } from "@/components/ui/starfall-portfolio-landing";

const customPortfolioData: PortfolioPageProps = {
  logo: {
    initials: 'AT',
    name: 'Alex Thompson',
  },
  navLinks: [
    { label: 'Bio', href: '#about' },
    { label: 'Work', href: '#projects' },
    { label: 'Expertise', href: '#skills' },
  ],
  resume: {
    label: 'Download CV',
    onClick: () => alert('Downloading CV...'),
  },
  hero: {
    titleLine1: 'Full-Stack Engineer &',
    titleLine2Gradient: 'UX Architect',
    subtitle: 'I build robust and scalable web applications with a strong focus on user-centric design and performance.',
  },
  ctaButtons: {
    primary: {
      label: 'Explore My Work',
      onClick: () => { document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); },
    },
    secondary: {
      label: 'Contact Me',
      onClick: () => { window.location.href = 'mailto:alex.thompson@example.com'; },
    },
  },
  projects: [
    { 
      title: 'E-commerce Platform', 
      description: 'A scalable online store built with Next.js, TypeScript, and Stripe.',
      tags: ['Next.js', 'Stripe', 'Vercel'],
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400',
      externalLink: 'https://example.com/ecommerce'
    },
    { 
      title: 'SaaS Dashboard', 
      description: 'A real-time analytics dashboard for a B2B software-as-a-service product.',
      tags: ['React', 'Chart.js', 'Firebase'],
      mediaType: 'youtube',
      mediaUrl: 'dQw4w9WgXcQ',
      externalLink: 'https://example.com/dashboard'
    },
    { 
      title: 'AI Content Generator', 
      description: 'Leveraging OpenAI to generate marketing copy for businesses.',
      tags: ['SvelteKit', 'OpenAI', 'Tailwind CSS'],
      mediaType: 'custom',
      imageContent: <div className="text-2xl text-white/50">🤖</div>,
      externalLink: 'https://example.com/ai-generator'
    },
    { 
      title: 'Mobile Fitness App', 
      description: 'Cross-platform fitness tracking app with social features.',
      tags: ['React Native', 'Firebase', 'Redux'],
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
      externalLink: 'https://example.com/fitness'
    },
  ],
  stats: [
    { value: '7+', label: 'Years of Experience' },
    { value: '30+', label: 'Client Projects' },
    { value: '99%', label: 'Client Satisfaction' },
  ],
  showAnimatedBackground: true, // You can toggle the background
};

const DemoOne = () => {
  return <PortfolioPage {...customPortfolioData} />;
};

export { DemoOne };
