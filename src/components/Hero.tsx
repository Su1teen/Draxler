"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // ───── Parallax: video moves slower ─────
            gsap.to(videoRef.current, {
                yPercent: 30,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            });

            // ───── Content fades out + SCALES DOWN on scroll (Update 2) ─────
            gsap.to(contentRef.current, {
                opacity: 0,
                y: -60,
                scale: 0.7,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "15% top",
                    end: "55% top",
                    scrub: true,
                },
            });

            // ───── TYPEWRITER CHARACTER STAGGER (Update 2) ─────
            const titleEl = titleRef.current;
            if (titleEl) {
                const lines = titleEl.querySelectorAll(".hero-char-wrap");
                const allChars: HTMLSpanElement[] = [];

                lines.forEach((line) => {
                    const text = line.textContent || "";
                    line.textContent = "";
                    text.split("").forEach((char) => {
                        const span = document.createElement("span");
                        span.textContent = char;
                        span.style.display = "inline-block";
                        span.style.opacity = "0";
                        span.style.transform = "translateY(20px)";
                        if (char === " ") span.style.width = "0.3em";
                        line.appendChild(span);
                        allChars.push(span);
                    });
                });

                // Stagger reveal after preloader finishes (~3s)
                gsap.to(allChars, {
                    opacity: 1,
                    y: 0,
                    duration: 0.06,
                    stagger: 0.04,
                    ease: "power2.out",
                    delay: 3.0,
                });
            }

            // Subtitle fade-in (after typewriter)
            gsap.from(".hero-subtitle", {
                y: 30,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                delay: 3.8,
            });

            gsap.from(".hero-scroll-indicator", {
                opacity: 0,
                duration: 1,
                delay: 4.2,
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="hero-section" id="hero">
            <div ref={videoRef} className="hero-video-wrapper">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    src="/media/video.mp4"
                />
            </div>

            <div className="hero-overlay" />

            <div ref={contentRef} className="hero-content">
                <h1 ref={titleRef} className="hero-title">
                    <span className="hero-char-wrap hero-title-line">FORGED</span>
                    <span className="hero-char-wrap hero-title-gold">PERFECTION</span>
                </h1>
                <p className="hero-subtitle">
                    Aerospace-grade forged wheels for the extraordinary
                </p>
            </div>

            <div className="hero-scroll-indicator">
                <span>Scroll</span>
                <div className="scroll-line" />
            </div>
        </section>
    );
}
