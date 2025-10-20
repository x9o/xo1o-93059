import { Home, Code2, Briefcase, Layers, MessageSquare } from "lucide-react";
import { lazy, Suspense } from "react";
import { NavBar } from "@/components/ui/tubelight-navbar";

// Lazy load heavy components
const Hero = lazy(() => import("@/components/Hero"));
const Skills = lazy(() => import("@/components/Skills"));
const Projects = lazy(() => import("@/components/Projects"));
const Systems = lazy(() => import("@/components/Systems"));
const Contact = lazy(() => import("@/components/Contact"));
const Footer = lazy(() => import("@/components/Footer"));

const Index = () => {
  const navItems = [
    { name: 'Home', url: '#hero', icon: Home },
    { name: 'Skills', url: '#skills', icon: Code2 },
    { name: 'Projects', url: '#projects', icon: Briefcase },
    { name: 'Systems', url: '#systems', icon: Layers },
    { name: 'Contact', url: '#contact', icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen">
      <NavBar items={navItems} />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>}>
        <Hero />
      </Suspense>
      <Suspense fallback={<div className="py-20"><div className="animate-pulse bg-muted/30 h-96 rounded-lg"></div></div>}>
        <Skills />
      </Suspense>
      <Suspense fallback={<div className="py-20"><div className="animate-pulse bg-muted/30 h-96 rounded-lg"></div></div>}>
        <Projects />
      </Suspense>
      <Suspense fallback={<div className="py-20"><div className="animate-pulse bg-muted/30 h-96 rounded-lg"></div></div>}>
        <Systems />
      </Suspense>
      <Suspense fallback={<div className="py-20"><div className="animate-pulse bg-muted/30 h-96 rounded-lg"></div></div>}>
        <Contact />
      </Suspense>
      <Suspense fallback={<div className="py-4"><div className="animate-pulse bg-muted/30 h-16 rounded-lg"></div></div>}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
