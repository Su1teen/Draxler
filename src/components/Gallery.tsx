"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const galleryItems = [
    {
        src: "/media/car-image-1.jpg",
        name: "Any Size"
    },
    {
        src: "/media/car-image-2.jpg",
        name: "Any Design"
    },
    {
        src: "/media/car-image-3.jpg",
        name: "Any Wheels"
    },
];

export default function Gallery() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".gallery-section-label", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                },
            });

            gsap.from(".gallery-section-title", {
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
                delay: 0.1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                },
            });

            // Clip-path mask reveal with stagger
            const pillars = document.querySelectorAll(".gallery-pillar");
            pillars.forEach((pillar, i) => {
                gsap.fromTo(
                    pillar,
                    { clipPath: "inset(100% 0 0 0)" },
                    {
                        clipPath: "inset(0% 0 0 0)",
                        duration: 1.2,
                        ease: "power3.inOut",
                        delay: i * 0.1,
                        scrollTrigger: {
                            trigger: ".gallery-container",
                            start: "top 80%",
                        },
                    }
                );
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="gallery-section" id="gallery">
            <div className="gallery-section-label">Featured Vehicles</div>
            <h2 className="gallery-section-title">Built For Icons</h2>

            {/* Stable outer wrapper — fixed height, overflow hidden.
                Hover-driven flex changes happen INSIDE this box,
                so Lenis / ScrollTrigger never see a layout shift. */}
            <div className="gallery-stable-wrapper">
                <div className="gallery-container">
                    {galleryItems.map((item, index) => (
                        <div key={index} className="gallery-pillar">
                            <img
                                src={item.src}
                                alt={item.name}
                                loading="lazy"
                            />
                            <div className="gallery-pillar-overlay">
                                <div>
                                    <div className="gallery-pillar-name">{item.name}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
