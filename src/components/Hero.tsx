import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import GradientText from "@/components/ui/gradient-text";
import { SparklesCore } from "@/components/ui/sparkles";
import { memo, useCallback } from "react";
import { motion } from "framer-motion";

const Hero = memo(() => {
  const scrollToProjects = useCallback(() => {
    const projectsSection = document.getElementById("projects");
    projectsSection?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const scrollToSystems = useCallback(() => {
    const systemsSection = document.getElementById("systems");
    systemsSection?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section id="hero" className="relative min-h-screen bg-black">
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4">
        <div className="text-center space-y-6 w-full">
          <h1 className="text-5xl md:text-8xl font-bold">
            <div className="block mb-4">
              <GradientText
                colors={["#ffffff", "#768fffff", "#ffffff"]}
                animationSpeed={5}
               className="text-5xl md:text-8xl font-bold whitespace-nowrap"
               descenderPadding="0.08em"
              >
                Crafting Reliable
              </GradientText>
            </div>
            <div className="block">
              <GradientText
                colors={["#ffffff", "#768fffff", "#ffffff"]}
                animationSpeed={5}
                className="text-6xl md:text-8xl font-bold"
                descenderPadding="0.08em"
              >
               Lua Systems
              </GradientText>
            </div>
          </h1>
          
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            I'm xo1o, a professional Roblox scripter who specializes in simple, efficient Lua systems. 
            I've been making dependable, well-optimized, and engagement-focused games for 3+ years.
          </p>
          
          <div className="relative w-full max-w-3xl mx-auto h-32 my-8">
            {/* Neon glow gradients */}
            <div className="absolute left-20 right-20 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent blur-sm" />
            <div className="absolute left-20 right-20 top-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            <div className="absolute left-40 right-40 top-0 h-[5px] bg-gradient-to-r from-transparent via-purple-500 to-transparent blur-sm" />
            <div className="absolute left-40 right-40 top-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
            
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/20 to-pink-500/10 blur-2xl" />
            
            {/* Sparkles */}
            <SparklesCore
              background="transparent"
              minSize={0.6}
              maxSize={2}
              particleDensity={200}
              className="w-full h-full"
              particleColor="#A78BFA"
              speed={2}
            />
            
            {/* Radial fade */}
            <div className="absolute inset-0 bg-black [mask-image:radial-gradient(500px_150px_at_center,transparent_20%,black)]" />
          </div>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <InteractiveHoverButton
              text="Projects"
              className="w-32 border-white/20 text-white font-semibold [&_span]:pl-2"
              onClick={scrollToProjects}
            />
            <InteractiveHoverButton
              text="Systems"
              className="w-32 border-white/20 text-white font-semibold [&_span]:pl-2"
              onClick={scrollToSystems}
            />
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = "Hero";

export default Hero;
