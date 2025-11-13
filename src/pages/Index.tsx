import { PortfolioPage, PortfolioPageProps } from "@/components/ui/starfall-portfolio-landing";
import { Clock, FileCode, Palette, DollarSign, Smartphone } from 'lucide-react';


const Index = () => {
  const portfolioData: PortfolioPageProps = {
    logo: {
      initials: <img src="/favicon.ico" alt="Logo" className="w-full h-full object-contain" />,
      name: 'xo1o',
    },
    navLinks: [
      { label: 'About', href: '#about' },
      { label: 'Games', href: '#games' },
      { label: 'Past Work', href: '#pastwork' },
    ],
    hero: {
      titleLine1: "xo1o's Portfolio",
      titleLine2Gradient: (
        <span
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #2CA1B7 50%, transparent 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Professional Scripter
        </span>
      ),
      subtitle: "Helping you bring your game ideas to life with advanced scripting services.",

    },
    ctaButtons: {
      primary: {
        label: 'View My Work',
        onClick: () => { document.getElementById('games')?.scrollIntoView({ behavior: 'smooth' }); },
      },
      secondary: {
        label: 'Get In Touch',
        onClick: () => { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); },
      },
    },
    deliverables: [
      {
        title: 'Full-stack game loops',
        description: '7-14 day builds',
        icon: <Clock className="w-8 h-8" />,
      },
      {
        title: 'Clean, documented code',
        description: 'Easy to customize',
        icon: <FileCode className="w-8 h-8" />,
      },
      {
        title: 'Reskin-ready architecture',
        description: 'Swap themes in <2 hours',
        icon: <Palette className="w-8 h-8" />,
      },
      {
        title: 'Monetization systems',
        description: 'Pre-integrated',
        icon: <DollarSign className="w-8 h-8" />,
      },
      {
        title: 'Mobile-optimized UI/UX',
        description: 'Responsive design',
        icon: <Smartphone className="w-8 h-8" />,
      },
    ],
    games: [
      { 
        title: 'Steal A Streamer', 
        description: 'Steal a brainrot clone. I scripted the the entire game, including mechanics like stealing, guaranteed drops, monetisaion, the base system, and much more.', 
        tags: ['Full Stack', 'Monetization', 'Game Systems'], 
        mediaType: 'image',
        mediaUrl: 'https://tr.rbxcdn.com/180DAY-473399814d57d63f73e44d7ba2d3bf46/768/432/Image/Webp/noFilter',
        externalLink: 'https://www.roblox.com/games/78545085335980/Steal-a-Streamer',
      }, 
      { 
        title: 'Fish And Hatch A Brainrot', 
        description: 'New upcoming game', 
        tags: ['Full Stack'], 
        mediaType: 'image',
        mediaUrl: 'https://tr.rbxcdn.com/180DAY-3e7a2a3d42fa03bf45571599f3328c13/768/432/Image/Webp/noFilter',
        externalLink: 'https://www.roblox.com/',
      }, 
      { 
        title: 'Miami 1986', 
        description: 'Currently a scripter for the game. Created an efficient job entry system, with a modular checkpoint system and job tiers, currently refactoring lobby system.', 
        tags: ['Systems', 'Core Scripter'], 
        mediaType: 'image',
        mediaUrl: 'https://tr.rbxcdn.com/180DAY-d3f26b91f5e7d83300fdcf44b4193da7/768/432/Image/Webp/noFilter',
        externalLink: 'https://www.roblox.com/games/4780772099/Miami-1986',
      }, 
      { 
        title: 'Oak Wood Equestrian', 
        description: 'Past scripter for the game. Worked on the shop and NPC dialogue system', 
        tags: ['Systems', 'Scripter'], 
        mediaType: 'image',
        mediaUrl: 'https://tr.rbxcdn.com/180DAY-ba2f4a9fad1e3251400c6e238a97ffe9/768/432/Image/Webp/noFilter',
        externalLink: 'https://www.roblox.com/games/13716884245/Oak-Wood-Equestrian-Version-1-OG',
      },
      
       { 
        title: 'Rat Battles', 
        description: 'Systems refiner', 
        tags: ['Scripter'], 
        mediaType: 'image',
        mediaUrl: 'https://tr.rbxcdn.com/180DAY-6a298e5126a58974662ee608b60a24b9/256/256/Image/Webp/noFilter',
        externalLink: 'https://www.roblox.com/games/105408622025169/Rat-Battles',
      },
      { 
        title: 'Slap a Brainrot', 
        description: 'Mechanics scripted include: Egg restock and shop system, brainrot inventory and placing, money + offline earnings, trading system, selling brainrots, and a mutation system through the slap tool.', 
        tags: ['Brainrot', 'Systems', 'Monetization'], 
        mediaType: 'youtube',
        mediaUrl: 'JkuypVC5okQ',
        externalLink: 'https://youtu.be/JkuypVC5okQ',
      },
      { 
        title: 'Obscured', 
        description: 'Horror game. I scripted: Enemy AI, round system, UI hooks and animations.', 
        tags: ['Complete System', 'Advanced Mechanics'], 
        mediaType: 'youtube',
        mediaUrl: 'X2kgIgzRH2s',
        externalLink: 'https://youtu.be/X2kgIgzRH2s',
      },
      { 
        title: 'Smash Legends', 
        description: 'Unfinished game inspired by brawl stars, scripted core combat mechanics, character system + main menu UI. full game not shown in demo.', 
        tags: ['Combat', 'Character Systems'], 
        mediaType: 'youtube',
        mediaUrl: 'IXgdFqOi28Y',
        externalLink: 'https://youtu.be/IXgdFqOi28Y',
      },
      { 
        title: "Don't Touch it!", 
        description: 'Unreleasead game similar to hot potato. Scripted core game loop and mechanics.', 
        tags: ['Game Logic'], 
        mediaType: 'youtube',
        mediaUrl: 'R6QtlJj3h4U',
        externalLink: 'https://youtu.be/R6QtlJj3h4U',
      },
      { 
        title: 'Acid Escape', 
        description: 'Game similar to Counter Strike Zombies, with a round system, infested and survivors. Scripted UI hooks and movement mechanics', 
        tags: ['Physics', 'Player Systems'], 
        mediaType: 'youtube',
        mediaUrl: 'lYoSqpGbvfg',
        externalLink: 'https://youtu.be/lYoSqpGbvfg',
      },
    ],
    pastWork: [
      { 
        title: 'UI + Dialogue Animations', 
        description: 'Satisfying UI animations and sounds. Dialogue system inspired by grow a garden.', 
        tags: ['UI'], 
        mediaType: 'youtube',
        mediaUrl: '-Gu-dhytVR8',
        externalLink: 'https://youtu.be/-Gu-dhytVR8',
      }, 
      { 
        title: 'Exploding Star Skill', 
        description: 'VFX, SFX and Animations not created by me, remake from heroes battlegrounds', 
        tags: ['Combat', 'VFX', 'Skill System'], 
        mediaType: 'youtube',
        mediaUrl: 'qHOpq5fvPY8',
        externalLink: 'https://youtu.be/qHOpq5fvPY8',
      }, 
      { 
        title: 'Full Pet System', 
        description: 'Including the inventory, equip functionality and pet hover/follow. Pet models are placeholder freemods', 
        tags: ['Inventory', 'Systems', 'Pets'], 
        mediaType: 'youtube',
        mediaUrl: 'qVIv0Px6oPU',
        externalLink: 'https://youtu.be/qVIv0Px6oPU',
      },
      { 
        title: 'Pet Hatching/Rolling Animation', 
        description: 'VFX and pet models are placeholder freemods, scripted by me.', 
        tags: ['Animation', 'VFX', 'Monetization'], 
        mediaType: 'youtube',
        mediaUrl: '3tJj6wgwNrE',
        externalLink: 'https://youtu.be/3tJj6wgwNrE',
      },
      { 
        title: 'Lightning Skill with Map Destruction', 
        description: 'VFX, SFX and Animations not created by me', 
        tags: ['Physics', 'Combat', 'Destruction'], 
        mediaType: 'youtube',
        mediaUrl: 'kFlqp30BkyU',
        externalLink: 'https://youtu.be/kFlqp30BkyU',
      },
      { 
        title: 'Weapon Combat + Movement System', 
        description: 'Complete combat system with advanced movement mechanics', 
        tags: ['Combat', 'Movement', 'Weapons'], 
        mediaType: 'youtube',
        mediaUrl: 'vujfuxX9gUY',
        externalLink: 'https://youtu.be/vujfuxX9gUY',
      },
      { 
        title: 'Pathfinding System', 
        description: 'Semi-advanced pathfinding system with visualiser', 
        tags: ['Pathfinding', 'Systems'], 
        mediaType: 'youtube',
        mediaUrl: 'o1_icChz3MU',
        externalLink: 'https://youtu.be/o1_icChz3MU',
      },
    ],
    stats: [
      { value: '3.5+', label: 'Years of experience' },
      { value: '10+', label: 'Games contributed' },
      { value: '4M+', label: 'Visits Contributed' },
    ],
    discordUsername: 'xo1o',
    showAnimatedBackground: true,
  };

  return (
    <>
   
      <PortfolioPage {...portfolioData} />
    </>
  );
};

export default Index;
