'use client'
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GradientCard = ({ children, className }: GradientCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateX = -(y / rect.height) * 5;
      const rotateY = (x / rect.width) * 5;

      setRotation({ x: rotateX, y: rotateY });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn("relative rounded-[32px] overflow-hidden w-full h-full", className)}
      style={{
        transformStyle: "preserve-3d",
        backgroundColor: "#000000",
        boxShadow: "0 -10px 80px 10px rgba(255, 255, 255, 0.06), 0 0 10px 0 rgba(0, 0, 0, 0.5)",
      }}
      initial={{ y: 0 }}
      animate={{
        y: isHovered ? -5 : 0,
        rotateX: rotation.x,
        rotateY: rotation.y,
        perspective: 1000,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Glass reflection overlay */}
      <motion.div
        className="absolute inset-0 z-35 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.05) 100%)",
          backdropFilter: "blur(2px)",
        }}
        animate={{
          opacity: isHovered ? 0.7 : 0.5,
          rotateX: -rotation.x * 0.2,
          rotateY: -rotation.y * 0.2,
          z: 1,
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut"
        }}
      />

      {/* Dark background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(180deg, #000000 0%, #000000 70%)",
        }}
        animate={{
          z: -1
        }}
      />

      {/* Noise texture overlay */}
      <motion.div
        className="absolute inset-0 opacity-30 mix-blend-overlay z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
        animate={{
          z: -0.5
        }}
      />

      {/* Faint white glow effect */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-2/3 z-20"
        style={{
          background: `
            radial-gradient(ellipse at bottom right, rgba(255, 255, 255, 0.18) -10%, rgba(255, 255, 255, 0) 70%),
            radial-gradient(ellipse at bottom left, rgba(255, 255, 255, 0.18) -10%, rgba(255, 255, 255, 0) 70%)
          `,
          filter: "blur(36px)",
        }}
        animate={{
          opacity: isHovered ? 0.6 : 0.5,
          y: isHovered ? rotation.x * 0.5 : 0,
          z: 0
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut"
        }}
      />

      {/* Central white glow */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-2/3 z-21"
        style={{
          background: `radial-gradient(circle at bottom center, rgba(255, 255, 255, 0.22) -20%, rgba(255, 255, 255, 0) 60%)`,
          filter: "blur(40px)",
        }}
        animate={{
          opacity: isHovered ? 0.5 : 0.45,
          y: isHovered ? `calc(10% + ${rotation.x * 0.3}px)` : "10%",
          z: 0
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut"
        }}
      />

      {/* Enhanced bottom border glow */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] z-25"
        style={{
          background: "linear-gradient(90deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.6) 50%, rgba(255, 255, 255, 0.08) 100%)",
        }}
        animate={{
          boxShadow: isHovered
            ? "0 0 20px 4px rgba(255, 255, 255, 0.35), 0 0 30px 6px rgba(255, 255, 255, 0.25), 0 0 40px 8px rgba(255, 255, 255, 0.15)"
            : "0 0 15px 3px rgba(255, 255, 255, 0.28), 0 0 25px 5px rgba(255, 255, 255, 0.18), 0 0 35px 7px rgba(255, 255, 255, 0.12)",
          opacity: isHovered ? 1 : 0.9,
          z: 0.5
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut"
        }}
      />

      {/* Left corner glow */}
      <motion.div
        className="absolute bottom-0 left-0 h-1/4 w-[1px] z-25 rounded-full"
        style={{
          background: "linear-gradient(to top, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.35) 20%, rgba(255, 255, 255, 0.2) 40%, rgba(255, 255, 255, 0.08) 60%, rgba(255, 255, 255, 0) 80%)",
        }}
        animate={{
          boxShadow: isHovered
            ? "0 0 20px 4px rgba(255, 255, 255, 0.25), 0 0 30px 6px rgba(255, 255, 255, 0.15), 0 0 40px 8px rgba(255, 255, 255, 0.1)"
            : "0 0 15px 3px rgba(255, 255, 255, 0.2), 0 0 25px 5px rgba(255, 255, 255, 0.12), 0 0 35px 7px rgba(255, 255, 255, 0.08)",
          opacity: isHovered ? 1 : 0.9,
          z: 0.5
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut"
        }}
      />

      {/* Left edge glow */}
      <motion.div
        className="absolute bottom-0 left-0 h-1/4 z-25"
        style={{
          background: "linear-gradient(to top, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.35) 15%, rgba(255, 255, 255, 0.22) 30%, rgba(255, 255, 255, 0.12) 45%, rgba(255, 255, 255, 0.06) 70%, rgba(255, 255, 255, 0) 85%)",
        }}
        animate={{
          boxShadow: isHovered
            ? "0 0 20px 4px rgba(255, 255, 255, 0.25), 0 0 30px 6px rgba(255, 255, 255, 0.15), 0 0 40px 8px rgba(255, 255, 255, 0.1)"
            : "0 0 15px 3px rgba(255, 255, 255, 0.2), 0 0 25px 5px rgba(255, 255, 255, 0.12), 0 0 35px 7px rgba(255, 255, 255, 0.08)",
          opacity: isHovered ? 1 : 0.9,
          z: 0.5
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut"
        }}
      />

      {/* Right corner glow */}
      <motion.div
        className="absolute bottom-0 right-0 h-1/4 w-[1px] z-25 rounded-full"
        style={{
          background: "linear-gradient(to top, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.35) 20%, rgba(255, 255, 255, 0.2) 40%, rgba(255, 255, 255, 0.08) 60%, rgba(255, 255, 255, 0) 80%)",
        }}
        animate={{
          boxShadow: isHovered
            ? "0 0 20px 4px rgba(255, 255, 255, 0.25), 0 0 30px 6px rgba(255, 255, 255, 0.15), 0 0 40px 8px rgba(255, 255, 255, 0.1)"
            : "0 0 15px 3px rgba(255, 255, 255, 0.2), 0 0 25px 5px rgba(255, 255, 255, 0.12), 0 0 35px 7px rgba(255, 255, 255, 0.08)",
          opacity: isHovered ? 1 : 0.9,
          z: 0.5
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut"
        }}
      />

      {/* Right edge glow */}
      <motion.div
        className="absolute bottom-0 right-0 h-1/3 z-25"
        style={{
          background: "linear-gradient(to top, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.55) 15%, rgba(255, 255, 255, 0.4) 30%, rgba(255, 255, 255, 0.25) 45%, rgba(255, 255, 255, 0.1) 70%, rgba(255, 255, 255, 0) 85%)",
        }}
        animate={{
          boxShadow: isHovered
            ? "0 0 20px 4px rgba(255, 255, 255, 0.25), 0 0 30px 6px rgba(255, 255, 255, 0.15), 0 0 40px 8px rgba(255, 255, 255, 0.1)"
            : "0 0 15px 3px rgba(255, 255, 255, 0.2), 0 0 25px 5px rgba(255, 255, 255, 0.12), 0 0 35px 7px rgba(255, 255, 255, 0.08)",
          opacity: isHovered ? 1 : 0.9,
          z: 0.5
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut"
        }}
      />

      {/* Card content */}
      <motion.div
        className="relative h-full z-40"
        animate={{
          z: 2
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
