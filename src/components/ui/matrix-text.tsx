"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LetterState {
    char: string;
    isMatrix: boolean;
    isSpace: boolean;
}

interface MatrixTextProps {
    text?: string;
    className?: string;
    initialDelay?: number;
    letterAnimationDuration?: number;
    letterInterval?: number;
}

export const MatrixText = ({
    text = "HelloWorld!",
    className,
    initialDelay = 200,
    letterAnimationDuration = 500,
    letterInterval = 100,
}: MatrixTextProps) => {
    const [letters, setLetters] = useState<LetterState[]>(() =>
        text.split("").map((char) => ({
            char,
            isMatrix: false,
            isSpace: char === " ",
        }))
    );
    const [isAnimating, setIsAnimating] = useState(false);

    const getRandomChar = useCallback(
        () => (Math.random() > 0.5 ? "1" : "0"),
        []
    );

    const animateLetter = useCallback(
        (index: number) => {
            if (index >= text.length) return;

            requestAnimationFrame(() => {
                setLetters((prev) => {
                    const newLetters = [...prev];
                    if (!newLetters[index].isSpace) {
                        newLetters[index] = {
                            ...newLetters[index],
                            char: getRandomChar(),
                            isMatrix: true,
                        };
                    }
                    return newLetters;
                });

                setTimeout(() => {
                    setLetters((prev) => {
                        const newLetters = [...prev];
                        newLetters[index] = {
                            ...newLetters[index],
                            char: text[index],
                            isMatrix: false,
                        };
                        return newLetters;
                    });
                }, letterAnimationDuration);
            });
        },
        [getRandomChar, text, letterAnimationDuration]
    );

    const startAnimation = useCallback(() => {
        if (isAnimating) return;

        setIsAnimating(true);
        let currentIndex = 0;

        const animate = () => {
            if (currentIndex >= text.length) {
                setIsAnimating(false);
                return;
            }

            animateLetter(currentIndex);
            currentIndex++;
            setTimeout(animate, letterInterval);
        };

        animate();
    }, [animateLetter, text, isAnimating, letterInterval]);

    useEffect(() => {
        const timer = setTimeout(startAnimation, initialDelay);
        
        // Set up interval to repeat animation every 5 seconds
        const interval = setInterval(() => {
            startAnimation();
        }, 25000);
        
        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [startAnimation, initialDelay]);

    const motionVariants = useMemo(
        () => ({
            matrix: {
                color: "#a855f7",
                textShadow: "0 2px 4px rgba(168, 85, 247, 0.5)",
            },
        }),
        []
    );

    // Render letters grouped into word containers so words don't break across lines.
    const renderWords = () => {
        const nodes: React.ReactNode[] = [];
        let i = 0;

        while (i < letters.length) {
            const letter = letters[i];

            if (letter.isSpace) {
                // Render spaces as a single non-breaking space element
                nodes.push(
                    <motion.div
                        key={`space-${i}`}
                        className="font-mono w-[1ch] text-center overflow-hidden"
                        initial="initial"
                        animate={letter.isMatrix ? "matrix" : "normal"}
                        variants={motionVariants}
                        transition={{ duration: 0.1, ease: "easeInOut" }}
                        style={{ display: "inline-block", fontVariantNumeric: "tabular-nums" }}
                    >
                        {"\u00A0"}
                    </motion.div>
                );
                i++;
                continue;
            }

            // Collect a whole word (sequence of non-space letters)
            const start = i;
            const wordNodes: React.ReactNode[] = [];

            while (i < letters.length && !letters[i].isSpace) {
                const l = letters[i];
                wordNodes.push(
                    <motion.div
                        key={`${i}-${l.char}`}
                        className="font-mono w-[1ch] text-center overflow-hidden"
                        initial="initial"
                        animate={l.isMatrix ? "matrix" : "normal"}
                        variants={motionVariants}
                        transition={{ duration: 0.1, ease: "easeInOut" }}
                        style={{ display: "inline-block", fontVariantNumeric: "tabular-nums" }}
                    >
                        {l.char}
                    </motion.div>
                );
                i++;
            }

            // Wrap the word's letters in an inline-flex container with no wrapping between letters
            nodes.push(
                <span key={`word-${start}`} className="inline-flex whitespace-nowrap">
                    {wordNodes}
                </span>
            );
        }

        return nodes;
    };

    return (
        <div
            className={cn(
                "flex items-center justify-center",
                className
            )}
            aria-label="Matrix text animation"
        >
            <div className="flex items-center justify-center">
                <div className="flex flex-wrap items-center justify-center">
                    {letters.map((letter, index) => (
                        <motion.div
                            key={`${index}-${letter.char}`}
                            className="font-mono w-[1ch] text-center overflow-hidden"
                            initial="initial"
                            animate={letter.isMatrix ? "matrix" : "normal"}
                            variants={motionVariants}
                            transition={{
                                duration: 0.1,
                                ease: "easeInOut",
                            }}
                            style={{
                                display: "inline-block",
                                fontVariantNumeric: "tabular-nums",
                            }}
                        >
                            {letter.isSpace ? "\u00A0" : letter.char}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
