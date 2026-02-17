"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
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

export default function HeroSlider() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [manualResetToken, setManualResetToken] = useState(0);

    const imageCount = HERO_IMAGES.length;

    const goTo = useCallback((nextIndex: number, fromUser = false) => {
        setDirection(nextIndex >= activeIndex ? 1 : -1);
        setActiveIndex(nextIndex);
        if (fromUser) {
            setManualResetToken((prev) => prev + 1);
        }
    }, [activeIndex]);

    const goNext = useCallback((fromUser = false) => {
        const nextIndex = (activeIndex + 1) % imageCount;
        setDirection(1);
        setActiveIndex(nextIndex);
        if (fromUser) {
            setManualResetToken((prev) => prev + 1);
        }
    }, [activeIndex, imageCount]);

    const goPrev = useCallback((fromUser = false) => {
        const prevIndex = (activeIndex - 1 + imageCount) % imageCount;
        setDirection(-1);
        setActiveIndex(prevIndex);
        if (fromUser) {
            setManualResetToken((prev) => prev + 1);
        }
    }, [activeIndex, imageCount]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            goNext(false);
        }, AUTOPLAY_MS);

        return () => window.clearTimeout(timer);
    }, [activeIndex, manualResetToken, goNext]);

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
                    initial={{ opacity: 0, scale: 1.14 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{
                        opacity: transition,
                        scale: { duration: 6.6, ease: "linear" },
                    }}
                >
                    <Image
                        src={HERO_IMAGES[activeIndex]}
                        alt="DRAXLER Hero"
                        fill
                        sizes="100vw"
                        priority={activeIndex === 0}
                        loading={activeIndex === 0 ? "eager" : "lazy"}
                        className="hero-slide-image"
                    />
                </motion.div>
            </AnimatePresence>

            <div className="hero-slider-bottom-gradient" />

            <div className="hero-slider-arrows" aria-hidden>
                <button
                    className="hero-slider-arrow hero-slider-arrow--left"
                    onClick={() => goPrev(true)}
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={22} strokeWidth={1.5} />
                </button>
                <button
                    className="hero-slider-arrow hero-slider-arrow--right"
                    onClick={() => goNext(true)}
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
                        onClick={() => goTo(index, true)}
                        aria-label={`Go to slide ${index + 1}`}
                        aria-current={activeIndex === index}
                    />
                ))}
            </div>
        </div>
    );
}
