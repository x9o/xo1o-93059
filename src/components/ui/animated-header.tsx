import { useEffect, useRef, useState } from "react";
import { GradualSpacing } from "./gradual-spacing";
import { cn } from "@/lib/utils";

interface AnimatedHeaderProps {
  text: string;
  className?: string;
  gradientText?: string;
}

export const AnimatedHeader = ({ text, className, gradientText }: AnimatedHeaderProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => {
      if (headerRef.current) {
        observer.unobserve(headerRef.current);
      }
    };
  }, []);

  // Split text into parts if there's gradient text
  const parts = gradientText ? text.split(gradientText) : [text];

  return (
    <div ref={headerRef} className="overflow-hidden">
      {isVisible ? (
        gradientText ? (
          // If gradientText is provided but not desired, render plain text without gradient styling
          <GradualSpacing
            text={text}
            className={cn(className)}
            duration={0.5}
            delayMultiple={0.04}
          />
        ) : (
          <GradualSpacing
            text={text}
            className={cn(className)}
            duration={0.5}
            delayMultiple={0.04}
          />
        )
      ) : (
        <h2 className={cn(className, "opacity-0")}>
          {gradientText ? (
            <>
              {parts[0]}<span className="gradient-text">{gradientText}</span>{parts[1]}
            </>
          ) : (
            text
          )}
        </h2>
      )}
    </div>
  );
};
