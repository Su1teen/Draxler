"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "./ThemeProvider";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const previewItems = [
    {
        id: 1,
        title: "Technic",
        description: "Technic Series",
        slug: "technic",
    },
    {
        id: 2,
        title: "Floating Spokes",
        description: "Floating Spokes Series",
        slug: "floating-spokes",
    },
    {
        id: 3,
        title: "Casual",
        description: "Casual Series",
        slug: "casual",
    },
];

export default function HomeCatalogPreview() {
    const { theme } = useTheme();
    const sectionRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current || !gridRef.current) return;

        const ctx = gsap.context(() => {
            const cards = gridRef.current!.querySelectorAll(".home-catalog-card");
            gsap.fromTo(
                cards,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.12,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const imageTone = theme === "dark" ? "black" : "white";

    return (
        <section ref={sectionRef} className="home-catalog-section" id="home-catalog">
            <div ref={gridRef} className="home-catalog-grid">
                {previewItems.map((item) => (
                    <Link
                        key={item.id}
                        href={`/catalog/${item.slug}`}
                        className="home-catalog-card"
                    >
                        <Image
                            src={`/catalog/catalog_${item.id}_${imageTone}.png`}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            loading="lazy"
                            className="home-catalog-image"
                        />
                        <div className="home-catalog-overlay" />
                        <div className="home-catalog-focus-content">
                            <div className="home-catalog-focus-title">{item.title}</div>
                            <div className="home-catalog-focus-desc">{item.description}</div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
