import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, PawPrint, Zap, Sword, MapPin } from "lucide-react";
import VideoPlayer from "@/components/ui/video-player";
import { GradientCard } from "@/components/ui/gradient-card";
import { AnimatedHeader } from "@/components/ui/animated-header";

const systems = [
  {
    title: "Exploding Star Skill",
    description: "VFX, SFX and Animations not created by me, remake from heroes battlegrounds",
    icon: Sparkles,
    tags: ["Combat", "VFX", "Skill System"],
    videoUrl:
      "https://youtu.be/qHOpq5fvPY8", // Replace with your system demo
  },
  {
    title: "Full Pet System",
    description:
      "Including the inventory, equip functionality and pet hover/follow. Pet models are placeholder freemods",
    icon: PawPrint,
    tags: ["Inventory", "Systems", "Pets"],
    videoUrl:
      "https://youtu.be/qVIv0Px6oPU", // Replace with your system demo
  },
  {
    title: "Pet Hatching/Rolling Animation",
    description: "VFX and pet models are placeholder freemods, scripted by me.",
    icon: PawPrint,
    tags: ["Animation", "VFX", "Monetization"],
    videoUrl:
      "https://youtu.be/3tJj6wgwNrE", // Replace with your system demo
  },
  {
    title: "Lightning Skill with Map Destruction",
    description: "VFX, SFX and Animations not created by me",
    icon: Zap,
    tags: ["Physics", "Combat", "Destruction"],
    videoUrl:
      "https://youtu.be/kFlqp30BkyU", // Replace with your system demo
  },
  {
    title: "Weapon Combat + Movement System",
    description: "Complete combat system with advanced movement mechanics",
    icon: Sword,
    tags: ["Combat", "Movement", "Weapons"],
    videoUrl: "https://youtu.be/vujfuxX9gUY", // Replace with your system demo
  },
  {
    title: "Pathfinding System",
    description: "Semi-advanced pathfinding system with visualiser",
    icon: MapPin,
    tags: ["Pathfinding", "Systems"],
    videoUrl: "https://youtu.be/o1_icChz3MU", // Replace with your system demo
  },
];

const Systems = () => {
  return (
    <section className="py-20 px-4 bg-black" id="systems">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <AnimatedHeader
            text="Featured Systems"
            className="text-4xl md:text-5xl font-bold mb-4"
          />
          <p className="text-muted-foreground text-lg">Custom systems and mechanics I've developed</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {systems.map((system, index) => (
            <GradientCard key={index}>
              <Card className="bg-transparent border-0 group overflow-hidden h-full">
                {system.videoUrl && (
                  <div className="w-full">
                    <VideoPlayer src={system.videoUrl} />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-accent/10 transition-colors">
                      <system.icon className="h-6 w-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl transition-colors mb-2">
                        {system.title}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed">{system.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {system.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="border-accent/50 text-accent text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </GradientCard>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground italic">
            Note: VFX, SFX, and animations mentioned are from original sources. All scripting and implementation is
            original work.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Systems;
