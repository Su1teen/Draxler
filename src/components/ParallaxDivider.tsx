"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function ParallaxDivider() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const section = sectionRef.current;
            const image = imageRef.current;
            if (!section || !image) return;

            // Image is 130% tall — it moves upward slower than the scroll,
            // creating a parallax "window" effect
            gsap.fromTo(
                image,
                { yPercent: -15 },
                {
                    yPercent: 15,
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: "top bottom", // animation starts when section enters viewport
                        end: "bottom top",   // ends when section leaves viewport
                        scrub: true,
                    },
                }
            );
        });

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="parallax-divider">
            <img
                ref={imageRef}
                src="/media/background.png"
                alt=""
                className="parallax-divider-img"
                draggable={false}
            />
        </section>
    );
}
