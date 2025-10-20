"use client";

import { FC, ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface HighlightCardProps {
  title: string;
  description: string[];
  icon?: ReactNode;
}

const HighlightCard: FC<HighlightCardProps> = ({ title, description, icon }) => {
  return (
    <div className="group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-rotate-1">
      <Card className="text-white rounded-2xl border border-neutral-700/20 bg-gradient-to-br from-[#0a0a0a] via-[#0c0c0c] to-[#0a0a0a] shadow-2xl relative backdrop-blur-xl overflow-hidden hover:border-neutral-600/30 hover:shadow-neutral-500/10 hover:shadow-3xl w-[350px]">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-neutral-300/5 to-neutral-100/5 opacity-20 group-hover:opacity-35 transition-opacity duration-500"></div>
          <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-gradient-to-tr from-neutral-300/10 to-transparent blur-3xl opacity-20 group-hover:opacity-35 transform group-hover:scale-110 transition-all duration-700"></div>
          <div className="absolute top-10 left-10 w-16 h-16 rounded-full bg-neutral-200/10 blur-xl"></div>
          <div className="absolute bottom-16 right-16 w-12 h-12 rounded-full bg-neutral-200/10 blur-lg"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-200/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
        </div>

        <div className="p-8 relative z-10 flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-neutral-300/15 opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
            <div className="absolute inset-0 rounded-full border border-neutral-200/15 opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>

            <div className="p-6 rounded-full backdrop-blur-lg border border-neutral-400/20 bg-gradient-to-br from-black/70 to-neutral-900/60 shadow-2xl transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 hover:shadow-neutral-400/15">
              <div className="transform group-hover:rotate-180 transition-transform duration-700">
                {icon}
              </div>
            </div>
          </div>

          <h3 className="mb-4 text-3xl font-bold text-neutral-200 transform group-hover:scale-105 transition-transform duration-300">
            {title}
          </h3>

          <div className="space-y-1 max-w-sm">
            {description.map((line, idx) => (
              <p
                key={idx}
                className="text-gray-300 text-sm leading-relaxed transform group-hover:text-gray-200 transition-colors duration-300"
              >
                {line}
              </p>
            ))}
          </div>

          <div className="mt-6 w-1/3 h-0.5 bg-gradient-to-r from-transparent via-neutral-200/60 to-transparent rounded-full transform group-hover:w-1/2 group-hover:h-1 transition-all duration-500"></div>

          <div className="flex space-x-2 mt-4 opacity-50 group-hover:opacity-90 transition-opacity duration-300">
            <div className="w-2 h-2 bg-neutral-300 rounded-full"></div>
            <div className="w-2 h-2 bg-neutral-300 rounded-full"></div>
            <div className="w-2 h-2 bg-neutral-300 rounded-full"></div>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-neutral-200/10 to-transparent rounded-br-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-neutral-200/10 to-transparent rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </Card>
    </div>
  );
};

export default HighlightCard;


