"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { getProductBySlug } from "@/lib/catalog-data";

export default function ProductDetailPage() {
    const params = useParams();
    const categorySlug = params.category as string;
    const productSlug = params.product as string;
    const result = getProductBySlug(categorySlug, productSlug);

    const imageWrapRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const heroBgRef = useRef<HTMLDivElement>(null);

    /* ── Magnetic parallax on wheel image ── */
    useEffect(() => {
        const wrap = imageWrapRef.current;
        const img = imageRef.current;
        if (!wrap || !img) return;

        const xTo = gsap.quickTo(img, "x", {
            duration: 0.6,
            ease: "power3.out",
        });
        const yTo = gsap.quickTo(img, "y", {
            duration: 0.6,
            ease: "power3.out",
        });

        const handleMove = (e: MouseEvent) => {
            const rect = wrap.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 24;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 24;
            xTo(x);
            yTo(y);
        };

        const handleLeave = () => {
            xTo(0);
            yTo(0);
        };

        wrap.addEventListener("mousemove", handleMove);
        wrap.addEventListener("mouseleave", handleLeave);

        return () => {
            wrap.removeEventListener("mousemove", handleMove);
            wrap.removeEventListener("mouseleave", handleLeave);
        };
    }, []);

    /* ── Top background parallax on scroll ── */
    useEffect(() => {
        const bg = heroBgRef.current;
        if (!bg) return;

        const yTo = gsap.quickTo(bg, "y", {
            duration: 0.6,
            ease: "power3.out",
        });

        const onScroll = () => {
            const offset = Math.min(window.scrollY * 0.5, 250);
            yTo(offset);
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    /* ── Entrance animations ── */
    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ delay: 0.15 });

            tl.from(".product-image-wrap", {
                opacity: 0,
                x: -50,
                duration: 0.9,
                ease: "power3.out",
            });

            tl.from(
                ".product-title",
                { opacity: 0, y: 30, duration: 0.7, ease: "power3.out" },
                "-=0.5"
            );

            tl.from(
                ".product-desc",
                { opacity: 0, y: 20, duration: 0.6, ease: "power3.out" },
                "-=0.35"
            );

            tl.from(
                ".product-sizes",
                { opacity: 0, y: 20, duration: 0.5, ease: "power3.out" },
                "-=0.25"
            );

            tl.from(
                ".product-cta",
                { opacity: 0, y: 20, duration: 0.5, ease: "power3.out" },
                "-=0.2"
            );
        });

        return () => ctx.revert();
    }, [productSlug]);

    if (!result) {
        return (
            <div className="catalog-not-found">
                <h1>Product Not Found</h1>
                <Link href="/">Return Home</Link>
            </div>
        );
    }

    const { product, category } = result;

    return (
        <>
            <section className="product-parallax-hero" aria-hidden="true">
                <div ref={heroBgRef} className="product-parallax-bg" />
            </section>

            <div className="product-detail-layer">
                <div className="catalog-breadcrumbs">
                    <Link href="/">Home</Link>
                    <span className="catalog-breadcrumb-sep">/</span>
                    <Link href="/catalog">Catalog</Link>
                    <span className="catalog-breadcrumb-sep">/</span>
                    <Link href={`/catalog/${categorySlug}`}>
                        {category.name}
                    </Link>
                    <span className="catalog-breadcrumb-sep">/</span>
                    <span className="catalog-breadcrumb-active">
                        {product.name}
                    </span>
                </div>

                <div ref={contentRef} className="product-detail">
                    <div ref={imageWrapRef} className="product-image-wrap">
                        <img
                            ref={imageRef}
                            src={product.image}
                            alt={product.name}
                            className="product-image"
                            draggable={false}
                        />
                    </div>

                    <div className="product-content">
                        <h1 className="product-title">{product.name}</h1>
                        <p className="product-desc">{product.description}</p>

                        <div className="product-sizes">
                            <div className="product-sizes-label">
                                Available Sizes
                            </div>
                            <div className="product-sizes-list">
                                {product.sizes.map((size, i) => (
                                    <span key={size}>
                                        <span className="product-size">{size}</span>
                                        {i < product.sizes.length - 1 && (
                                            <span className="product-size-sep">
                                                |
                                            </span>
                                        )}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <button className="catalog-cta-btn product-cta">
                            Request Quote
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
