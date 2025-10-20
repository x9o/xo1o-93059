import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

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

export interface PortfolioPageProps {
  logo?: { initials: React.ReactNode; name: React.ReactNode; };
  navLinks?: NavLink[];
  resume?: { label: string; onClick?: () => void; };
  hero?: { titleLine1: React.ReactNode; titleLine2Gradient: React.ReactNode; subtitle: React.ReactNode; };
  ctaButtons?: { primary: { label: string; onClick?: () => void; }; secondary: { label: string; onClick?: () => void; }; };
  projects?: Project[];
  stats?: Stat[];
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
  logo: { initials: 'MT', name: 'Meng To' },
  navLinks: [ { label: 'About', href: '#about' }, { label: 'Projects', href: '#projects' }, { label: 'Skills', href: '#skills' } ],
  resume: { label: 'Resume', onClick: () => {} },
  hero: { titleLine1: 'Creative Developer &', titleLine2Gradient: 'Digital Designer', subtitle: 'I craft beautiful digital experiences through code and design. Specializing in modern web development, UI/UX design, and bringing innovative ideas to life.', },
  ctaButtons: { primary: { label: 'View My Work', onClick: () => {} }, secondary: { label: 'Get In Touch', onClick: () => {} }, },
  projects: [ 
    { title: 'FinTech Mobile App', description: 'React Native app with AI-powered financial insights.', tags: ['React Native', 'Node.js'], mediaType: 'custom' as const, imageContent: undefined }, 
    { title: 'Data Visualization Platform', description: 'Interactive dashboard for complex data analysis.', tags: ['D3.js', 'Python'], mediaType: 'custom' as const, imageContent: undefined }, 
    { title: '3D Portfolio Site', description: 'Immersive WebGL experience with 3D elements.', tags: ['Three.js', 'WebGL'], mediaType: 'custom' as const, imageContent: undefined }, 
  ],
  stats: [ { value: '50+', label: 'Projects Completed' }, { value: '5+', label: 'Years Experience' }, { value: '15+', label: 'Happy Clients' }, ],
};

// --- MAIN CUSTOMIZABLE PORTFOLIO COMPONENT ---
const PortfolioPage: React.FC<PortfolioPageProps> = ({
  logo = defaultData.logo,
  navLinks = defaultData.navLinks,
  resume = defaultData.resume,
  hero = defaultData.hero,
  ctaButtons = defaultData.ctaButtons,
  projects = defaultData.projects,
  stats = defaultData.stats,
  showAnimatedBackground = true,
}) => {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const projectsPerView = 3;
  
  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentProjectIndex(prev => {
      const newIndex = prev - 1;
      return newIndex < 0 ? projects.length - 1 : newIndex;
    });
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentProjectIndex(prev => {
      const newIndex = prev + 1;
      return newIndex >= projects.length ? 0 : newIndex;
    });
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  const visibleProjects = [];
  for (let i = 0; i < projectsPerView; i++) {
    const index = (currentProjectIndex + i) % projects.length;
    visibleProjects.push(projects[index]);
  }
  
  return (
    <div className="bg-background text-foreground geist-font">
      {showAnimatedBackground && <AuroraBackground />}
      <div className="relative">
        <nav className="w-full px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-border backdrop-blur-md border border-border flex items-center justify-center">
                        <span className="geist-font text-sm font-bold text-foreground">{logo.initials}</span>
                    </div>
                    <span className="geist-font text-lg font-medium text-foreground">{logo.name}</span>
                </div>
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map(link => (
                        <a key={link.label} href={link.href} className="text-muted-foreground hover:text-foreground transition-colors inter-font text-sm">{link.label}</a>
                    ))}
                </div>
                <button onClick={resume.onClick} className="glass-button px-4 py-2 rounded-lg text-foreground text-sm font-medium inter-font">{resume.label}</button>
            </div>
        </nav>
        <div className="divider" />
        <main id="about" className="w-full min-h-screen flex flex-col items-center justify-center px-6 py-20">
            <div className="max-w-6xl mx-auto text-center">
                <div className="mb-8 float-animation">
                    <h1 className="md:text-6xl lg:text-7xl leading-[1.1] geist-font text-5xl font-light text-foreground tracking-tight mb-4">
                        {hero.titleLine1}
                        <span className="gradient-text block tracking-tight">{hero.titleLine2Gradient}</span>
                    </h1>
                    <p className="md:text-xl max-w-3xl leading-relaxed inter-font text-lg font-light text-muted-foreground mx-auto">{hero.subtitle}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                    <button onClick={ctaButtons.primary.onClick} className="primary-button px-6 py-3 text-foreground rounded-lg font-medium text-sm min-w-[160px]">{ctaButtons.primary.label}</button>
                    <button onClick={ctaButtons.secondary.onClick} className="glass-button min-w-[160px] inter-font text-sm font-medium text-foreground rounded-lg px-6 py-3">{ctaButtons.secondary.label}</button>
                </div>
                <div className="divider mb-16" />
                <div id="projects" className="relative max-w-6xl mx-auto mb-16">
                    {/* Navigation Buttons */}
                    <button
                        onClick={handlePrev}
                        disabled={isAnimating}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 glass-button w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-50 transition-all hover:scale-110 active:scale-95"
                        aria-label="Previous projects"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <button
                        onClick={handleNext}
                        disabled={isAnimating}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 glass-button w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-50 transition-all hover:scale-110 active:scale-95"
                        aria-label="Next projects"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                    
                    {/* Projects Grid */}
                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                        {visibleProjects.map((project, index) => (
                            <div key={`${currentProjectIndex}-${index}`} className="glass-card rounded-2xl p-6 text-left animate-fade-in">
                                <div className="project-image rounded-xl h-48 mb-4 overflow-hidden relative group">
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
                        ))}
                    </div>
                </div>
                <div className="divider mb-16" />
                <div id="skills" className="flex flex-col sm:flex-row justify-center items-center gap-8 text-center">
                    {stats.map((stat, index) => (
                        <React.Fragment key={stat.label}>
                            <div>
                                <div className="text-3xl md:text-4xl font-light text-foreground mb-1 geist-font tracking-tight">{stat.value}</div>
                                <div className="text-muted-foreground text-sm inter-font font-normal">{stat.label}</div>
                            </div>
                            {index < stats.length - 1 && <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-input to-transparent" />}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </main>
      </div>
    </div>
  );
};

export {PortfolioPage};
