import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight, ExternalLink, Copy, Clock, FileCode, Palette, DollarSign, Smartphone, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SparklesCore } from '@/components/ui/sparkles';

// Helper functions for Roblox visit counts
const formatVisits = (visits: number): string => {
  if (visits >= 1000000) {
    return `${(visits / 1000000).toFixed(1)}M`;
  } else if (visits >= 1000) {
    return `${(visits / 1000).toFixed(1)}K`;
  }
  return visits.toString();
};

const extractPlaceId = (url: string): string | null => {
  const match = url.match(/\/games\/(\d+)\//);
  return match ? match[1] : null;
};
// --- TYPE DEFINITIONS FOR PROPS ---
interface NavLink { label: string; href: string; }
interface Project { 
  title: string; 
  description: string; 
  tags: string[]; 
  imageContent?: React.ReactNode;
  mediaType?: 'image' | 'youtube' | 'custom';
  mediaUrl?: string;
  externalLink?: string;
}
interface Stat { value: string; label: string; }
interface DeliverableCard {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface PortfolioPageProps {
  logo?: { initials: React.ReactNode; name: React.ReactNode; };
  navLinks?: NavLink[];
  resume?: { label: string; onClick?: () => void; };
  hero?: { titleLine1: React.ReactNode; titleLine2Gradient: React.ReactNode; subtitle: React.ReactNode; };
  ctaButtons?: { primary: { label: string; onClick?: () => void; }; secondary: { label: string; onClick?: () => void; }; };
  deliverables?: DeliverableCard[];
  games?: Project[];
  pastWork?: Project[];
  stats?: Stat[];
  discordUsername?: string;
  showAnimatedBackground?: boolean;
}

// --- INTERNAL ANIMATED BACKGROUND COMPONENT ---
const AuroraBackground: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!mountRef.current) return;
        const currentMount = mountRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.style.position = 'fixed';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.left = '0';
        renderer.domElement.style.zIndex = '0';
        renderer.domElement.style.display = 'block';
        currentMount.appendChild(renderer.domElement);
        const material = new THREE.ShaderMaterial({
            uniforms: { iTime: { value: 0 }, iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) } },
            vertexShader: `void main() { gl_Position = vec4(position, 1.0); }`,
            fragmentShader: `
                uniform float iTime; uniform vec2 iResolution;
                #define NUM_OCTAVES 3
                float rand(vec2 n) { return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }
                float noise(vec2 p){ vec2 ip=floor(p);vec2 u=fract(p);u=u*u*(3.0-2.0*u);float res=mix(mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);return res*res; }
                float fbm(vec2 x) { float v=0.0;float a=0.3;vec2 shift=vec2(100);mat2 rot=mat2(cos(0.5),sin(0.5),-sin(0.5),cos(0.50));for(int i=0;i<NUM_OCTAVES;++i){v+=a*noise(x);x=rot*x*2.0+shift;a*=0.4;}return v;}
                void main() {
                    vec2 p=((gl_FragCoord.xy)-iResolution.xy*0.5)/iResolution.y*mat2(6.,-4.,4.,6.);vec4 o=vec4(0.);float f=2.+fbm(p+vec2(iTime*5.,0.))*.5;
                    for(float i=0.;i++<35.;){vec2 v=p+cos(i*i+(iTime+p.x*.08)*.025+i*vec2(13.,11.))*3.5;float tailNoise=fbm(v+vec2(iTime*.5,i))*.3*(1.-(i/35.));vec4 auroraColors=vec4(.1+.3*sin(i*.2+iTime*.4),.3+.5*cos(i*.3+iTime*.5),.7+.3*sin(i*.4+iTime*.3),1.);vec4 currentContribution=auroraColors*exp(sin(i*i+iTime*.8))/length(max(v,vec2(v.x*f*.015,v.y*1.5)));float thinnessFactor=smoothstep(0.,1.,i/35.)*.6;o+=currentContribution*(1.+tailNoise*.8)*thinnessFactor;}
                    o=tanh(pow(o/100.,vec4(1.6)));gl_FragColor=o*1.5;
                }`
        });
        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        let animationFrameId: number;
        const animate = () => { animationFrameId = requestAnimationFrame(animate); material.uniforms.iTime.value += 0.016; renderer.render(scene, camera); };
        const handleResize = () => { renderer.setSize(window.innerWidth, window.innerHeight); material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight); };
        window.addEventListener('resize', handleResize);
        animate();
        return () => { cancelAnimationFrame(animationFrameId); window.removeEventListener('resize', handleResize); if (currentMount.contains(renderer.domElement)) currentMount.removeChild(renderer.domElement); renderer.dispose(); material.dispose(); geometry.dispose(); };
    }, []);
    return <div ref={mountRef} />;
};

// --- DEFAULT DATA ---
const defaultData = {
  logo: { initials: 'X0', name: 'X0L00X' },
  navLinks: [ { label: 'About', href: '#about' }, { label: 'Games', href: '#games' }, { label: 'Past Work', href: '#pastwork' }, { label: 'Skills', href: '#skills' } ],
  resume: { label: 'Resume', onClick: () => {} },
  hero: { titleLine1: 'Game Developer &', titleLine2Gradient: 'Scripter', subtitle: 'I create immersive gaming experiences and robust systems through advanced scripting. Specializing in Roblox development, game mechanics, and bringing innovative gameplay ideas to life.', },
  ctaButtons: { primary: { label: 'View My Games', onClick: () => {} }, secondary: { label: 'Get In Touch', onClick: () => {} }, },
  games: [ 
    { 
      title: 'Steal A Streamer [Demo Game]', 
      description: 'Game fully scripted by me.', 
      tags: ['Full Stack', 'Monetization', 'Game Systems'], 
      mediaType: 'image' as const, 
      mediaUrl: 'https://tr.rbxcdn.com/180DAY-473399814d57d63f73e44d7ba2d3bf46/768/432/Image/Webp/noFilter',
      externalLink: 'https://www.roblox.com/games/78545085335980/Steal-a-Streamer'
    }, 
    { 
      title: 'Miami 1986 [2.0M+ Visits]', 
      description: 'Currently a scripter for the game.', 
      tags: ['Systems', 'Core Scripter'], 
      mediaType: 'image' as const, 
      mediaUrl: 'https://tr.rbxcdn.com/180DAY-d3f26b91f5e7d83300fdcf44b4193da7/768/432/Image/Webp/noFilter',
      externalLink: 'https://www.roblox.com/games/4780772099/Miami-1986'
    }, 
    { 
      title: 'Oak Wood Equestrian [1.5M+ Visits]', 
      description: 'Past scripter for the game.', 
      tags: ['Systems', 'Scripter'], 
      mediaType: 'image' as const, 
      mediaUrl: 'https://tr.rbxcdn.com/180DAY-ba2f4a9fad1e3251400c6e238a97ffe9/768/432/Image/Webp/noFilter',
      externalLink: 'https://www.roblox.com/games/13716884245/Oak-Wood-Equestrian-Version-1-OG'
    },
    { 
      title: 'Upcoming Brainrot Game', 
      description: 'Everything seen is scripted by me', 
      tags: ['Brainrot', 'Systems', 'Monetization'], 
      mediaType: 'youtube' as const, 
      mediaUrl: 'JkuypVC5okQ',
      externalLink: 'https://youtu.be/JkuypVC5okQ'
    },
    { 
      title: 'Obscured', 
      description: 'Fully scripted by me.', 
      tags: ['Complete System', 'Advanced Mechanics'], 
      mediaType: 'youtube' as const, 
      mediaUrl: 'X2kgIgzRH2s',
      externalLink: 'https://youtu.be/X2kgIgzRH2s'
    },
    { 
      title: 'Smash Legends', 
      description: 'Fully scripted by me.', 
      tags: ['Combat', 'Character Systems'], 
      mediaType: 'youtube' as const, 
      mediaUrl: 'IXgdFqOi28Y',
      externalLink: 'https://youtu.be/IXgdFqOi28Y'
    }
  ],
  pastWork: [ 
    { 
      title: 'Exploding Star Skill', 
      description: 'VFX, SFX and Animations not created by me, remake from heroes battlegrounds', 
      tags: ['Combat', 'VFX', 'Skill System'], 
      mediaType: 'youtube' as const, 
      mediaUrl: 'qHOpq5fvPY8',
      externalLink: 'https://youtu.be/qHOpq5fvPY8'
    }, 
    { 
      title: 'Full Pet System', 
      description: 'Including the inventory, equip functionality and pet hover/follow. Pet models are placeholder freemods', 
      tags: ['Inventory', 'Systems', 'Pets'], 
      mediaType: 'youtube' as const, 
      mediaUrl: 'qVIv0Px6oPU',
      externalLink: 'https://youtu.be/qVIv0Px6oPU'
    },
    { 
      title: 'Pet Hatching/Rolling Animation', 
      description: 'VFX and pet models are placeholder freemods, scripted by me.', 
      tags: ['Animation', 'VFX', 'Monetization'], 
      mediaType: 'youtube' as const, 
      mediaUrl: '3tJj6wgwNrE',
      externalLink: 'https://youtu.be/3tJj6wgwNrE'
    },
    { 
      title: 'Lightning Skill with Map Destruction', 
      description: 'VFX, SFX and Animations not created by me', 
      tags: ['Physics', 'Combat', 'Destruction'], 
      mediaType: 'youtube' as const, 
      mediaUrl: 'kFlqp30BkyU',
      externalLink: 'https://youtu.be/kFlqp30BkyU'
    },
    { 
      title: 'Weapon Combat + Movement System', 
      description: 'Complete combat system with advanced movement mechanics', 
      tags: ['Combat', 'Movement', 'Weapons'], 
      mediaType: 'youtube' as const, 
      mediaUrl: 'vujfuxX9gUY',
      externalLink: 'https://youtu.be/vujfuxX9gUY'
    },
    { 
      title: 'Pathfinding System', 
      description: 'Semi-advanced pathfinding system with visualiser', 
      tags: ['Pathfinding', 'Systems'], 
      mediaType: 'youtube' as const, 
      mediaUrl: 'o1_icChz3MU',
      externalLink: 'https://youtu.be/o1_icChz3MU'
    }
  ],
  stats: [ { value: '10+', label: 'Games Worked On' }, { value: '6+', label: 'Custom Systems' }, { value: '4M+', label: 'Total Game Visits' }, ],
};

// --- PROJECT GALLERY COMPONENT ---
const ProjectGallery: React.FC<{ projects: Project[]; title: string; id: string }> = ({ projects, title, id }) => {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(projects.length);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [visitsData, setVisitsData] = useState<Record<string, number>>({});
  
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Fetch visit counts for Roblox games
  useEffect(() => {
    const fetchAllVisits = async () => {
      try {
        const robloxGames = projects.filter(
          (game) => game.externalLink?.includes('roblox.com/games')
        );

        const placeIds = robloxGames
          .map((game) => extractPlaceId(game.externalLink || ''))
          .filter((id): id is string => id !== null);

        if (placeIds.length === 0) return;

        // Fetch universe IDs
        const universePromises = placeIds.map((placeId) =>
          fetch(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`)
            .then((res) => res.json())
            .then((data) => ({ placeId, universeId: data.universeId }))
            .catch(() => ({ placeId, universeId: null }))
        );

        const universeResults = await Promise.all(universePromises);
        const validUniverseIds = universeResults
          .filter((result) => result.universeId)
          .map((result) => result.universeId);

        if (validUniverseIds.length === 0) return;

        // Fetch game data
        const gameResponse = await fetch(
          `https://games.roblox.com/v1/games?universeIds=${validUniverseIds.join(',')}`
        );
        const gameData = await gameResponse.json();

        const visitsMap: Record<string, number> = {};
        gameData.data?.forEach((game: { id: number; visits: number }) => {
          const universeResult = universeResults.find(
            (result) => result.universeId === game.id
          );
          if (universeResult) {
            const matchingGame = robloxGames.find(
              (g) => extractPlaceId(g.externalLink || '') === universeResult.placeId
            );
            if (matchingGame && matchingGame.externalLink) {
              visitsMap[matchingGame.externalLink] = game.visits;
            }
          }
        });

        setVisitsData(visitsMap);
      } catch (error) {
        console.error('Failed to fetch visits:', error);
      }
    };

    fetchAllVisits();
  }, [projects]);
  
  // Create infinite loop by tripling the array
  const infiniteProjects = [...projects, ...projects, ...projects];
  
  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentProjectIndex(prev => prev - 1);
    setTimeout(() => {
      setIsTransitioning(false);
      setCurrentProjectIndex(current => {
        if (current <= 0) {
          return projects.length;
        }
        return current;
      });
    }, 300);
  };
  
  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentProjectIndex(prev => prev + 1);
    setTimeout(() => {
      setIsTransitioning(false);
      setCurrentProjectIndex(current => {
        if (current >= projects.length * 2) {
          return projects.length;
        }
        return current;
      });
    }, 300);
  };
  
  // Render card helper
  const renderCard = (project: Project, index: number) => (
    <div key={`${project.title}-${index}`} className="glass-card rounded-2xl p-4 sm:p-6 text-left flex-shrink-0 w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
      <div className="project-image rounded-xl h-40 sm:h-48 mb-4 overflow-hidden relative group">
        {/* Visits Badge */}
        {project.externalLink && visitsData[project.externalLink] && (
          <div className="absolute top-3 right-3 z-10">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/90 backdrop-blur-sm rounded-full text-primary-foreground text-sm font-bold shadow-lg">
              <Eye className="w-4 h-4" />
              {formatVisits(visitsData[project.externalLink])} visits
            </div>
          </div>
        )}
        {project.mediaType === 'image' && project.mediaUrl ? (
          <img 
            src={project.mediaUrl} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : project.mediaType === 'youtube' && project.mediaUrl ? (
          <iframe
            src={`https://www.youtube.com/embed/${project.mediaUrl}`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {project.imageContent}
          </div>
        )}
      </div>
      
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-medium text-card-foreground geist-font flex-1">{project.title}</h3>
        {project.externalLink && (
          <a
            href={project.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 p-1.5 glass-button rounded-lg hover:bg-white/10 transition-all"
            aria-label="Open external link"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
      
      <p className="text-muted-foreground text-sm inter-font mb-4">{project.description}</p>
      <div className="flex flex-wrap gap-2">
        {project.tags.map(tag => (
          <span key={tag} className="skill-badge px-2 py-1 rounded text-xs text-muted-foreground">{tag}</span>
        ))}
      </div>
    </div>
  );
  
  // Calculate transform based on current index and viewport
  const calculateTransform = () => {
    if (isMobile) {
      // Mobile: 100% width cards with 0.75rem gap
      return `translateX(calc(-${currentProjectIndex * 100}% - ${currentProjectIndex * 0.75}rem))`;
    } else if (isTablet) {
      // Tablet: 50% width cards with 1rem gap
      return `translateX(calc(-${currentProjectIndex * 50}% - ${currentProjectIndex * 1}rem))`;
    } else {
      // Desktop: 33.333% width cards with 1.5rem gap
      return `translateX(calc(-${currentProjectIndex * 33.333}% - ${currentProjectIndex * 1.5}rem))`;
    }
  };

  return (
    <div id={id} className="mb-12 sm:mb-16">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-foreground mb-6 sm:mb-8 text-center geist-font tracking-tight px-4">{title}</h2>
      <div className="relative max-w-6xl w-full mx-auto px-4 sm:px-8 lg:px-12">
        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          disabled={isTransitioning}
          className="absolute left-2 sm:-left-4 lg:-left-12 top-1/2 -translate-y-1/2 z-20 pointer-events-auto glass-button w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center disabled:opacity-50 transition-all hover:scale-110 active:scale-95"
          aria-label="Previous projects"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        
        <button
          onClick={handleNext}
          disabled={isTransitioning}
          className="absolute right-2 sm:-right-4 lg:-right-12 top-1/2 -translate-y-1/2 z-20 pointer-events-auto glass-button w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center disabled:opacity-50 transition-all hover:scale-110 active:scale-95"
          aria-label="Next projects"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        
        {/* Projects Strip Container */}
        <div className="overflow-hidden">
          <div 
            className="flex gap-3 sm:gap-4 lg:gap-6 transition-transform duration-300 ease-in-out"
            style={{
              transform: calculateTransform()
            }}
          >
            {infiniteProjects.map((project, index) => renderCard(project, index))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN CUSTOMIZABLE PORTFOLIO COMPONENT ---
const PortfolioPage: React.FC<PortfolioPageProps> = ({
  logo = defaultData.logo,
  navLinks = defaultData.navLinks,
  resume = defaultData.resume,
  hero = defaultData.hero,
  ctaButtons = defaultData.ctaButtons,
  deliverables,
  games = defaultData.games,
  pastWork = defaultData.pastWork,
  stats = defaultData.stats,
  discordUsername,
  showAnimatedBackground = true,
}) => {
  const { toast } = useToast();
  const [isDiscordAnimating, setIsDiscordAnimating] = useState(false);

  const handleCopyDiscord = async () => {
    if (discordUsername) {
      try {
        await navigator.clipboard.writeText(discordUsername);
        setIsDiscordAnimating(true);
        toast({
          title: "Copied to clipboard!",
          description: `Discord username: ${discordUsername}`,
        });
        setTimeout(() => setIsDiscordAnimating(false), 600);
      } catch (error) {
        // Fallback method using a temporary textarea
        const textarea = document.createElement("textarea");
        textarea.value = discordUsername;
        textarea.style.position = "fixed"; // Prevent scrolling to the bottom
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
          document.execCommand("copy");
          setIsDiscordAnimating(true);
          toast({
            title: "Copied to clipboard!",
            description: `Discord username: ${discordUsername}`,
          });
          setTimeout(() => setIsDiscordAnimating(false), 600);
        } catch {
          toast({
            title: "Failed to copy!",
            description: "Please try again.",
            variant: "destructive",
          });
        } finally {
          document.body.removeChild(textarea);
        }
      }
    }
  };
  
  return (
    <div className="bg-background text-foreground geist-font w-full overflow-x-hidden">
      <div className="relative max-w-screen-xl mx-auto w-full px-4 sm:px-6">
        <nav className="w-full px-4 sm:px-6 py-4">
            <div className="max-w-7xl mx-auto flex flex-col items-center gap-2 sm:gap-3 md:flex-row md:justify-between md:items-center">
                <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-border backdrop-blur-md border border-border flex items-center justify-center">
                        <span className="geist-font text-xs sm:text-sm font-bold text-foreground">{logo.initials}</span>
                    </div>
                    <span className="geist-font text-sm sm:text-lg font-medium text-foreground">{logo.name}</span>
                </div>
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map(link => (
                        <a key={link.label} href={link.href} className="text-muted-foreground hover:text-foreground transition-colors inter-font text-sm">{link.label}</a>
                    ))}
                </div>
                <div className="flex md:hidden flex-wrap justify-center items-center gap-x-6 gap-y-2 pt-1">
                    {navLinks.map(link => (
                        <a key={link.label} href={link.href} className="text-muted-foreground hover:text-foreground transition-colors inter-font text-xs">{link.label}</a>
                    ))}
                </div>
            </div>
        </nav>
        <div className="divider" />
        <main id="about" className="w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-20">
            <div className="max-w-6xl w-full mx-auto text-center">
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] geist-font font-light text-foreground tracking-tight mb-4 break-words">
                            {hero.titleLine1}
                            <span className="gradient-text block tracking-tight">{hero.titleLine2Gradient}</span>
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl max-w-3xl leading-relaxed inter-font font-light text-muted-foreground mx-auto px-4 break-words">{hero.subtitle}</p>
                    </div>
                    {/* Sparkles + neon glow moved under description */}
                    <div className="relative w-full max-w-3xl h-16 mx-auto my-6">
                      {/* Neon gradient lines */}
                      <div className="absolute inset-x-10 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent blur-sm" />
                      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                      <div className="absolute inset-x-24 top-0 h-[5px] bg-gradient-to-r from-transparent via-accent/50 to-transparent blur-sm" />
                      <div className="absolute inset-x-24 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

                      {/* Sparkles */}
                      <SparklesCore
                        background="transparent"
                        minSize={0.6}
                        maxSize={1.6}
                        particleDensity={220}
                        className="w-full h-full"
                        particleColor="#ffffff"
                        speed={1.2}
                      />

                      {/* Radial fade to soften edges */}
                      <div className="pointer-events-none absolute inset-0 bg-background [mask-image:radial-gradient(500px_120px_at_center,transparent_25%,black)]" />
                    </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                    <button onClick={ctaButtons.primary.onClick} className="primary-button px-6 py-3 text-foreground rounded-lg font-medium text-sm min-w-[160px]">{ctaButtons.primary.label}</button>
                    <button onClick={ctaButtons.secondary.onClick} className="glass-button min-w-[160px] inter-font text-sm font-medium text-foreground rounded-lg px-6 py-3">{ctaButtons.secondary.label}</button>
                </div>
                <div className="divider mb-16" />
                
                {/* What I Deliver Section */}
                {deliverables && deliverables.length > 0 && (
                  <>
                    <div className="mb-12 sm:mb-16">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-foreground mb-6 sm:mb-8 text-center geist-font tracking-tight px-4">What I Deliver</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto px-4">
                        {deliverables.map((item, index) => (
                          <div 
                            key={index}
                            className="glass-card rounded-xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-lg group cursor-default"
                          >
                            <div className="mb-4 text-primary transition-transform duration-300 group-hover:scale-110">
                              {item.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2 geist-font">{item.title}</h3>
                            <p className="text-muted-foreground text-sm inter-font">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="divider mb-16" />
                  </>
                )}
                
                {/* Games Gallery */}
                {games && games.length > 0 && <ProjectGallery projects={games} title="Games" id="games" />}
                
                <div className="divider mb-16" />
                
                {/* Past Work Gallery */}
                {pastWork && pastWork.length > 0 && <ProjectGallery projects={pastWork} title="Past Work" id="pastwork" />}
                
                <div className="divider mb-12 sm:mb-16" />
                <div id="skills" className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8 text-center px-4">
                    {stats.map((stat, index) => (
                        <React.Fragment key={stat.label}>
                            <div>
                                <div className="text-2xl sm:text-3xl md:text-4xl font-light text-foreground mb-1 geist-font tracking-tight">{stat.value}</div>
                                <div className="text-muted-foreground text-xs sm:text-sm inter-font font-normal">{stat.label}</div>
                            </div>
                            {index < stats.length - 1 && <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-input to-transparent" />}
                        </React.Fragment>
                    ))}
                </div>
                
                {/* Discord Section */}
                {discordUsername && (
                    <>
                        <div className="divider my-8 sm:my-12" />
                        <div id="contact" className="flex justify-center px-4">
                            <button
                                onClick={handleCopyDiscord}
                                className="glass-button px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl flex items-center gap-2 sm:gap-3 hover:bg-white/10 transition-all group"
                                aria-label="Copy Discord username"
                            >
                                <svg 
                                    className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-500 ${isDiscordAnimating ? 'scale-125 rotate-12' : ''}`}
                                    viewBox="0 0 127.14 96.36"
                                    fill="currentColor"
                                >
                                    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                                </svg>
                                <span className="text-foreground font-medium inter-font text-sm sm:text-base">{discordUsername}</span>
                                <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </main>
      </div>
    </div>
  );
};

export {PortfolioPage};
