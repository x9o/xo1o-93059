import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Eye } from "lucide-react";
import VideoPlayer from "@/components/ui/video-player";
import { GradientCard } from "@/components/ui/gradient-card";
import { AnimatedHeader } from "@/components/ui/animated-header";
import { memo, useEffect, useState } from "react";

const releasedGames = [
  {
    title: "Steal A Streamer [Demo Game]",
    description: "Game fully scripted by me.",
    role: "Full Development",
    status: "Released",
    tags: ["Full Stack", "Monetization", "Game Systems"],
    imageUrl: "https://tr.rbxcdn.com/180DAY-473399814d57d63f73e44d7ba2d3bf46/768/432/Image/Webp/noFilter",
    link: "https://www.roblox.com/games/78545085335980/Steal-a-Streamer",
  },
  {
    title: "Miami 1986 [2.0M+ Visits]",
    description: "Currently a scripter for the game.",
    role: "Core Scripter",
    status: "Active Development",
    tags: ["Systems"],
    imageUrl: "https://tr.rbxcdn.com/180DAY-d3f26b91f5e7d83300fdcf44b4193da7/768/432/Image/Webp/noFilter",
    link: "https://www.roblox.com/games/4780772099/Miami-1986",
  },
  {
    title: "Oak Wood Equestrian [1.5M+ Visits]",
    description: "Past scripter for the game.",
    role: "Scripter",
    status: "Released",
    tags: ["Systems"],
    imageUrl: "https://tr.rbxcdn.com/180DAY-ba2f4a9fad1e3251400c6e238a97ffe9/768/432/Image/Webp/noFilter",
    link: "https://www.roblox.com/games/13716884245/Oak-Wood-Equestrian-Version-1-OG",
  },
];

const unreleasedGames = [
  {
    title: "Slap a Brainrot",
    description: "Everything seen is scripted by me",
    role: "Full Development",
    tags: ["Brainrot", "Systems", "Monetization"],
    videoUrl: "https://youtu.be/JkuypVC5okQ",
    link: "https://youtu.be/JkuypVC5okQ",
  },
  {
    title: "Obscured",
    description: "Fully scripted by me.",
    role: "Full Development",
    tags: ["Complete System", "Advanced Mechanics"],
    videoUrl: "https://youtu.be/X2kgIgzRH2s",
    link: "https://youtu.be/X2kgIgzRH2s",
  },
  {
    title: "Smash Legends",
    description: "Fully scripted by me.",
    role: "Full Development",
    tags: ["Combat", "Character Systems"],
    videoUrl: "https://youtu.be/IXgdFqOi28Y",
    link: "https://youtu.be/IXgdFqOi28Y",
  },
  {
    title: "Don't Touch it!",
    description: "Core systems development",
    role: "Systems Developer",
    tags: ["Game Logic"],
    videoUrl: "https://youtu.be/R6QtlJj3h4U",
    link: "https://youtu.be/R6QtlJj3h4U",
  },
  {
    title: "Acid Escape",
    description: "Advanced mechanics implementation",
    role: "Mechanics Developer",
    tags: ["Physics", "Player Systems"],
    videoUrl: "https://youtu.be/lYoSqpGbvfg",
    link: "https://youtu.be/lYoSqpGbvfg",
  },
];

const allGames = [...releasedGames, ...unreleasedGames];

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

const Projects = memo(() => {
  const [visitsData, setVisitsData] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchAllVisits = async () => {
      try {
        // Get all released games with Roblox links
        const robloxGames = releasedGames.filter(
          (game) => game.link.includes('roblox.com/games')
        );

        // Extract place IDs
        const placeIds = robloxGames
          .map((game) => extractPlaceId(game.link))
          .filter((id): id is string => id !== null);

        if (placeIds.length === 0) return;

        // Fetch universe IDs for all place IDs
        const universePromises = placeIds.map((placeId) =>
          fetch(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`)
            .then((res) => res.json())
            .then((data) => ({ placeId, universeId: data.universeId }))
        );

        const universeResults = await Promise.all(universePromises);
        const validUniverseIds = universeResults
          .filter((result) => result.universeId)
          .map((result) => result.universeId);

        if (validUniverseIds.length === 0) return;

        // Fetch all game data at once
        const gameResponse = await fetch(
          `https://games.roblox.com/v1/games?universeIds=${validUniverseIds.join(',')}`
        );
        const gameData = await gameResponse.json();

        // Map universe IDs back to place IDs and then to game links
        const visitsMap: Record<string, number> = {};
        gameData.data?.forEach((game: any) => {
          const universeResult = universeResults.find(
            (result) => result.universeId === game.id
          );
          if (universeResult) {
            const matchingGame = robloxGames.find(
              (g) => extractPlaceId(g.link) === universeResult.placeId
            );
            if (matchingGame) {
              visitsMap[matchingGame.link] = game.visits;
            }
          }
        });

        setVisitsData(visitsMap);
      } catch (error) {
        console.error('Failed to fetch visits:', error);
      }
    };

    fetchAllVisits();
  }, []);
  return (
    <section className="py-20 px-4 bg-black" id="projects">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <AnimatedHeader
            text="Games I've Worked On"
            className="text-4xl md:text-5xl font-bold mb-4"
          />
          <p className="text-muted-foreground text-lg">
            All videos are recorded using my account (X0L00X, aka iaintgivinuthechance)
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allGames.map((game, index) => (
              <GradientCard key={index}>
                <Card className="bg-transparent border-0 group overflow-hidden h-full">
                  {'imageUrl' in game && game.imageUrl && (
                    <div className="w-full aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={game.imageUrl}
                        alt={`${game.title} screenshot`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                      />
                    </div>
                  )}
                  {'videoUrl' in game && game.videoUrl && (
                    <div className="w-full">
                      <VideoPlayer src={game.videoUrl} />
                    </div>
                  )}
                  {'imageUrl' in game && game.imageUrl && visitsData[game.link] && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge variant="default" className="text-sm font-bold gap-1.5 px-3 py-1.5 bg-primary/90 backdrop-blur-sm">
                        <Eye className="h-4 w-4" />
                        {formatVisits(visitsData[game.link])} visits
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-xl transition-colors">
                        {game.title}
                      </CardTitle>
                      <a
                        href={game.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-5 w-5 text-muted-foreground transition-colors cursor-pointer" />
                      </a>
                    </div>
                    <CardDescription>
                      {game.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-primary text-primary">
                          {game.role}
                        </Badge>
                        {'status' in game && (
                          <Badge variant="secondary">{game.status}</Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {game.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </GradientCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

Projects.displayName = "Projects";

export default Projects;
