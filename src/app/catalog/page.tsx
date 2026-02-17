"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { catalogCategories } from "@/lib/catalog-data";

export default function CatalogIndexPage() {
    const gridRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!gridRef.current || !headerRef.current) return;

        const ctx = gsap.context(() => {
            gsap.from(headerRef.current, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: "power3.out",
                delay: 0.1,
            });

            const cards = gridRef.current!.querySelectorAll(".catalog-card");
            gsap.fromTo(
                cards,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.12,
                    ease: "power3.out",
                    delay: 0.25,
                }
            );
        });

        return () => ctx.revert();
    }, []);

    return (
        <>
            <div className="catalog-breadcrumbs">
                <Link href="/">Home</Link>
                <span className="catalog-breadcrumb-sep">/</span>
                <span className="catalog-breadcrumb-active">Catalog</span>
            </div>

            <div ref={headerRef} className="catalog-header">
                <h1 className="catalog-category-title">Our Collections</h1>
                <p className="catalog-category-desc">
                    Three distinct lines, one uncompromising standard. Select a
                    series to explore.
                </p>
            </div>

            <div ref={gridRef} className="catalog-grid">
                {catalogCategories.map((cat) => (
                    <Link
                        key={cat.slug}
                        href={`/catalog/${cat.slug}`}
                        className="catalog-card"
                    >
                        <div className="catalog-card-image-wrap">
                            <img
                                src={cat.products[0].image}
                                alt={cat.name}
                                className="catalog-img-default"
                                draggable={false}
                            />
                            <img
                                src={cat.products[0].hoverImage}
                                alt={cat.name}
                                className="catalog-img-hover"
                                draggable={false}
                            />
                        </div>
                        <div className="catalog-card-name">{cat.name}</div>
                    </Link>
                ))}
            </div>
        </>
    );
}
