import { Code2, Database, Zap, Layers, ShoppingCart, Gamepad2 } from "lucide-react";
import HighlightCard from "@/components/ui/highlight-card";
import { AnimatedHeader } from "@/components/ui/animated-header";

const skills = [
  {
    icon: Gamepad2,
    title: "Game Systems",
    items: ["Full brainrot game systems", "Plot systems", "Physics based mechanics", "Combat systems"],
  },
  {
    icon: ShoppingCart,
    title: "Monetization",
    items: ["Full shop systems", "Monetization optimization", "Complete pet systems", "Inventory management"],
  },
  {
    icon: Layers,
    title: "Architecture",
    items: ["Advanced modular systems", "OOP architecture", "ProfileService integration", "Scalable code structure"],
  },
  {
    icon: Code2,
    title: "Languages",
    items: ["LuaU (Expert)", "Python", "JavaScript", "C++"],
  },
  {
    icon: Zap,
    title: "UI/UX",
    items: ["Smooth UI animations", "Interactive effects", "Modern interfaces", "Responsive design"],
  },
  {
    icon: Database,
    title: "Backend",
    items: ["Data persistence", "Server optimization", "API integration", "Security best practices"],
  },
];

const Skills = () => {
  return (
    <section className="py-20 px-4 bg-black" id="skills">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <AnimatedHeader 
            text="What I Can Do"
            className="text-4xl md:text-5xl font-bold mb-4"
          />
          <p className="text-muted-foreground text-lg">Full-stack Roblox development expertise</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto place-items-center">
          {skills.map((skill, index) => (
            <HighlightCard
              key={index}
              title={skill.title}
              description={skill.items}
              icon={<skill.icon className="w-8 h-8 text-white" />}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
