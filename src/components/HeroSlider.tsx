"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HERO_IMAGES = [
    "/hero/hero1.jpg",
    "/hero/hero4.jpg",
    "/hero/hero5.jpg",
    "/hero/hero6.jpg",
    "/hero/hero7.jpg",
    "/hero/hero8.jpg",
    "/hero/hero9.jpg",
];

const AUTOPLAY_MS = 6400;
const IMAGE_COUNT = HERO_IMAGES.length;

export default function HeroSlider() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Stable callbacks — use functional updaters to avoid activeIndex dependency
    const resetTimer = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setDirection(1);
            setActiveIndex((prev) => (prev + 1) % IMAGE_COUNT);
        }, AUTOPLAY_MS);
    }, []);

    const goTo = useCallback((nextIndex: number) => {
        setActiveIndex((prev) => {
            setDirection(nextIndex >= prev ? 1 : -1);
            return nextIndex;
        });
        resetTimer();
    }, [resetTimer]);

    const goNext = useCallback(() => {
        setDirection(1);
        setActiveIndex((prev) => (prev + 1) % IMAGE_COUNT);
        resetTimer();
    }, [resetTimer]);

    const goPrev = useCallback(() => {
        setDirection(-1);
        setActiveIndex((prev) => (prev - 1 + IMAGE_COUNT) % IMAGE_COUNT);
        resetTimer();
    }, [resetTimer]);

    // Autoplay — start once, reset handled by user interactions
    useEffect(() => {
        resetTimer();
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [resetTimer]);

    const transition = useMemo(
        () => ({ duration: 2.3, ease: [0.16, 1, 0.3, 1] as const }),
        []
    );

    return (
        <div className="hero-slider" aria-label="Hero background slider">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={activeIndex}
                    className="hero-slide"
                    custom={direction}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.03 }}
                    transition={{
                        opacity: transition,
                        scale: { duration: 4.5, ease: "linear" },
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={HERO_IMAGES[activeIndex]}
                        alt="DRAXLER Hero"
                        className="hero-slide-image"
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    />
                </motion.div>
            </AnimatePresence>

            <div className="hero-slider-bottom-gradient" />

            <div className="hero-slider-arrows" aria-hidden>
                <button
                    className="hero-slider-arrow hero-slider-arrow--left"
                    onClick={goPrev}
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={22} strokeWidth={1.5} />
                </button>
                <button
                    className="hero-slider-arrow hero-slider-arrow--right"
                    onClick={goNext}
                    aria-label="Next slide"
                >
                    <ChevronRight size={22} strokeWidth={1.5} />
                </button>
            </div>

            <div className="hero-slider-controls" role="tablist" aria-label="Hero slides">
                {HERO_IMAGES.map((_, index) => (
                    <button
                        key={index}
                        className={`hero-slider-progress ${activeIndex === index ? "is-active" : ""}`}
                        onClick={() => goTo(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        aria-current={activeIndex === index}
                    />
                ))}
            </div>
        </div>
    );
}
