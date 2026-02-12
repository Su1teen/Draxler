"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeProvider";

export default function Navbar() {
    const navRef = useRef<HTMLElement>(null);
    const { theme, toggle } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const lastScrollY = useRef(0);

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
            className={`navbar ${scrolled ? "navbar--glass" : ""} ${hidden ? "navbar--hidden" : ""}`}
        >
            <div className="navbar-inner">
                <a href="#hero" className="navbar-logo">AERO</a>

                <div className="navbar-links">
                    <a href="#wheel" className="navbar-link">Showcase</a>
                    <a href="#gallery" className="navbar-link">Gallery</a>
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
