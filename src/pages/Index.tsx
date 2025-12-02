import React, { useEffect, useMemo, useState } from 'react';
import { PortfolioPage, PortfolioPageProps } from "@/components/ui/starfall-portfolio-landing";
import { Clock, FileCode, Palette, DollarSign, Smartphone } from 'lucide-react';

// Simple helpers reused from the projects widget
const formatVisits = (visits: number): string => {
  if (visits >= 1_000_000) return `${(visits / 1_000_000).toFixed(1)}m`;
  if (visits >= 1_000) return `${(visits / 1_000).toFixed(1)}k`;
  return visits.toString();
};

const extractPlaceId = (url: string): string | null => {
  const match = url.match(/\/games\/(\d+)\//);
  return match ? match[1] : null;
};

const Index = () => {
  const [totalVisits, setTotalVisits] = useState<number | null>(null);
  const [totalPlaying, setTotalPlaying] = useState<number | null>(null);
  const [metricsUnavailable, setMetricsUnavailable] = useState(false);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const robloxGames = portfolioData.games?.filter(
          (game) => game.externalLink?.includes('roblox.com/games')
        ) || [];

        const placeIds = [...new Set(
          robloxGames
            .map((game) => extractPlaceId(game.externalLink || ''))
            .filter((id): id is string => id !== null)
        )];

        if (placeIds.length === 0) return;

        // Try direct first, then fall back to a CORS proxy
        const proxyUrl = (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`;
        const fetchWithFallback = async (url: string) => {
          try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Status ${res.status}`);
            return await res.json();
          } catch (err) {
            const proxied = await fetch(proxyUrl(url));
            if (!proxied.ok) throw new Error(`Proxy status ${proxied.status}`);
            return proxied.json();
          }
        };

        const universePromises = placeIds.map((placeId) =>
          fetchWithFallback(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`)
            .then((data) => ({ placeId, universeId: data.universeId }))
            .catch(() => ({ placeId, universeId: null }))
        );

        const universeResults = await Promise.all(universePromises);
        const validUniverseIds = universeResults
          .filter((result) => result.universeId)
          .map((result) => result.universeId);

        if (validUniverseIds.length === 0) return;

        const gameData = await fetchWithFallback(
          `https://games.roblox.com/v1/games?universeIds=${validUniverseIds.join(',')}`
        );

        const totals = (gameData.data || []).reduce(
          (acc: { visits: number; playing: number }, game: { id: number; visits: number; playing?: number }) => {
            const universeResult = universeResults.find((result) => result.universeId === game.id);
            if (!universeResult) return acc;
            const matchesPortfolio = robloxGames.some(
              (g) => extractPlaceId(g.externalLink || '') === universeResult.placeId
            );
            if (matchesPortfolio) {
              acc.visits += game.visits || 0;
              acc.playing += game.playing || 0;
            }
            return acc;
          },
          { visits: 0, playing: 0 }
        );

        if (totals.visits > 0) setTotalVisits(totals.visits);
        if (totals.playing > 0) setTotalPlaying(totals.playing);
        setMetricsUnavailable(false);
      } catch (error) {
        console.error('Failed to fetch total visits/ccu:', error);
        setMetricsUnavailable(true);
      }
    };

    fetchTotals();
  }, []);

  const totalVisitsLabel = useMemo(() => {
    if (totalVisits !== null) return `${formatVisits(totalVisits)}+`;
    return metricsUnavailable ? 'N/A' : '4M+';
  }, [metricsUnavailable, totalVisits]);

  const totalPlayingLabel = useMemo(() => {
    if (totalPlaying !== null) return `${formatVisits(totalPlaying)}+`;
    return metricsUnavailable ? 'N/A' : '—';
  }, [metricsUnavailable, totalPlaying]);

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
        title: 'Spin A Brainrot', 
        description: 'Scripting contributor', 
        tags: ['Scripter'], 
        mediaType: 'image',
        mediaUrl: 'https://tr.rbxcdn.com/180DAY-fb14cc8ef8631bd093a38878bc282bee/768/432/Image/Webp/noFilter',
        externalLink: 'https://www.roblox.com/games/112371649846345/Spin-a-Brainrot',
      }, 
      { 
        title: '100 Players Enter 67', 
        description: 'Full-stack scripter, worked on core game loop, player systems, and monetization, basically the entire game.', 
        tags: ['Full Stack', 'Scripter'], 
        mediaType: 'image',
        mediaUrl: 'https://tr.rbxcdn.com/180DAY-815104f433a91efef5f48b807145d304/768/432/Image/Webp/noFilter',
        externalLink: 'https://www.roblox.com/games/92439626975142/100-Players-Enter-67',
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
      { value: totalPlayingLabel, label: 'Contributed CCU' },
      { value: totalVisitsLabel, label: 'Visits Contributed' },
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
