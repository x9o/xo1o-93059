import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import GradientText from "@/components/ui/gradient-text";
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
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-5xl md:text-8xl font-bold"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
              className="block mb-4"
            >
              <GradientText
                colors={["#ffffff", "#768fffff", "#ffffff"]}
                animationSpeed={5}
               className="text-5xl md:text-8xl font-bold whitespace-nowrap"
               descenderPadding="0.08em"
              >
                Crafting Reliable
              </GradientText>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
              className="block"
            >
              <GradientText
                colors={["#ffffff", "#768fffff", "#ffffff"]}
                animationSpeed={5}
                className="text-6xl md:text-8xl font-bold"
                descenderPadding="0.08em"
              >
               Lua Systems
              </GradientText>
            </motion.div>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-lg text-white/80 max-w-2xl mx-auto"
          >
            I'm xo1o, a professional Roblox scripter who specializes in simple, efficient Lua systems. 
            I've been making dependable, well-optimized, and engagement-focused games for 3+ years.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            className="flex flex-wrap gap-4 justify-center pt-4"
          >
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
          </motion.div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = "Hero";

export default Hero;
