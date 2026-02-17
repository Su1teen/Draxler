"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";

export default function Navbar() {
    const navRef = useRef<HTMLElement>(null);
    const { theme, toggle } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const lastScrollY = useRef(0);
    const pathname = usePathname();
    const isHome = pathname === "/";

    // Catalog dropdown
    const [catalogOpen, setCatalogOpen] = useState(false);
    const dropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const openCatalog = useCallback(() => {
        if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
        setCatalogOpen(true);
    }, []);

    const closeCatalog = useCallback(() => {
        dropdownTimer.current = setTimeout(() => setCatalogOpen(false), 200);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY;
            const delta = y - lastScrollY.current;

            // Show frosted glass after scrolling 80px
            setScrolled(y > 80);

            // Hide on scroll down (> 10px delta), show on scroll up
            if (delta > 10 && y > 200) {
                setHidden(true);
            } else if (delta < -5) {
                setHidden(false);
            }

            lastScrollY.current = y;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            ref={navRef}
            className={`navbar ${(scrolled || !isHome) ? "navbar--glass" : ""} ${hidden ? "navbar--hidden" : ""}`}
        >
            <div className="navbar-inner">
                <Link href="/" className="navbar-logo">DRAXLER</Link>

                <div className="navbar-links">
                    <a href="/#wheel" className="navbar-link">Showcase</a>

                    <div
                        className="navbar-catalog-wrap"
                        onMouseEnter={openCatalog}
                        onMouseLeave={closeCatalog}
                    >
                        <span className={`navbar-link navbar-link--has-dropdown ${catalogOpen ? "navbar-link--active" : ""}`}>
                            Catalog
                        </span>
                        <div className={`catalog-dropdown ${catalogOpen ? "catalog-dropdown--visible" : ""}`}>
                            <Link href="/catalog/forged-series" className="catalog-dropdown-item" onClick={() => setCatalogOpen(false)}>
                                <span className="catalog-dropdown-label">Forged Series</span>
                                <span className="catalog-dropdown-count">3 models</span>
                            </Link>
                            <Link href="/catalog/carbon-series" className="catalog-dropdown-item" onClick={() => setCatalogOpen(false)}>
                                <span className="catalog-dropdown-label">Carbon Series</span>
                                <span className="catalog-dropdown-count">3 models</span>
                            </Link>
                            <Link href="/catalog/heritage" className="catalog-dropdown-item" onClick={() => setCatalogOpen(false)}>
                                <span className="catalog-dropdown-label">Heritage</span>
                                <span className="catalog-dropdown-count">3 models</span>
                            </Link>
                        </div>
                    </div>

                    <a href="/#gallery" className="navbar-link">Gallery</a>
                    <a href="#" className="navbar-link">Technology</a>
                    <a href="#" className="navbar-link">Contact</a>
                </div>

                <button
                    className="navbar-theme-toggle"
                    onClick={toggle}
                    aria-label="Toggle theme"
                >
                    {theme === "dark" ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5" />
                            <line x1="12" y1="1" x2="12" y2="3" />
                            <line x1="12" y1="21" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="3" y2="12" />
                            <line x1="21" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                    )}
                </button>
            </div>
        </nav>
    );
}
