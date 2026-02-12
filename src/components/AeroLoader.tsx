"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

interface AeroLoaderProps {
    /** Called when the loader exit animation completes (only for full-page loader) */
    onComplete?: () => void;
    /** If true, renders as a minimal inline loader (for Suspense fallbacks) */
    inline?: boolean;
}

export default function AeroLoader({ onComplete, inline = false }: AeroLoaderProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!onComplete) return; // inline loaders don't auto-dismiss

        // Let the breathing animation play for ~2.5s, then curtain-reveal out
        const timer = setTimeout(() => {
            if (!containerRef.current) return;

            gsap.to(containerRef.current, {
                y: "-100%",
                duration: 1,
                ease: "power3.inOut",
                onComplete: () => {
                    onComplete();
                },
            });
        }, 2500);

        return () => clearTimeout(timer);
    }, [onComplete]);

    // Breathing animation variants for the logo
    const breathe = {
        animate: {
            opacity: [1, 0.6, 1],
            transition: {
                duration: 2,
                ease: "easeInOut" as const,
                repeat: Infinity,
            },
        },
    };

    if (inline) {
        // Compact version for <Suspense> fallbacks inside canvases etc.
        return (
            <div className="aero-loader-inline">
                <motion.img
                    src="/media/aero%20logo.png"
                    alt="AERO"
                    className="aero-loader-logo-sm"
                    variants={breathe}
                    animate="animate"
                    draggable={false}
                />
            </div>
        );
    }

    // Full-page loader (replaces old Preloader)
    return (
        <div ref={containerRef} className="aero-loader">
            <motion.img
                src="/media/aero%20logo.png"
                alt="AERO"
                className="aero-loader-logo"
                variants={breathe}
                animate="animate"
                draggable={false}
            />
        </div>
    );
}
