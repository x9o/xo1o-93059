import { cn } from "@/lib/utils";
import {
  IconClock,
  IconBulb,
  IconAdjustments,
  IconMessageCircle,
  IconStar,
} from "@tabler/icons-react";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function FeaturesSectionWithHoverEffects({ features }: { features?: Feature[] }) {
  const defaultFeatures: Feature[] = [
    {
      title: "3.5 Years Experience",
      description: "3.5 years of experience scripting in Luau.",
      icon: <IconClock />,
    },
    {
      title: "Problem Solving",
      description: "Strong problem-solving skills and efficient debugging.",
      icon: <IconBulb />,
    },
    {
      title: "Flexible & Adaptable",
      description: "Flexible and able to adapt to different projects.",
      icon: <IconAdjustments />,
    },
    {
      title: "Easy Communication",
      description: "Easy to communicate and collaborate with.",
      icon: <IconMessageCircle />,
    },
    {
      title: "Exceeding Expectations",
      description: "Committed to exceeding your expectations.",
      icon: <IconStar />,
    },
  ];

  const displayFeatures = features || defaultFeatures;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative z-10 py-10 max-w-7xl mx-auto">
      {displayFeatures.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} totalCount={displayFeatures.length} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
  totalCount,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
  totalCount: number;
}) => {
  const isInTopRow = index < 3;
  const isFirstColumn = index % 3 === 0;
  const isLastInRow = (index + 1) % 3 === 0;

  return (
    <div
      className={cn(
        "flex flex-col py-10 relative group/feature border-border",
        "lg:border-r",
        isFirstColumn && "lg:border-l",
        isInTopRow && "lg:border-b",
        !isInTopRow && index === totalCount - 1 && isLastInRow && "lg:border-b"
      )}
    >
      {isInTopRow && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
      )}
      {!isInTopRow && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-muted-foreground">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-border group-hover/feature:bg-primary transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-foreground geist-font">
          {title}
        </span>
      </div>
      <p className="text-sm text-muted-foreground max-w-xs relative z-10 px-10 inter-font">
        {description}
      </p>
    </div>
  );
};
