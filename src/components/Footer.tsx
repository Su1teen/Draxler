"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Footer() {
    const btnRef = useRef<HTMLButtonElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const btn = btnRef.current;
        const wrapper = wrapperRef.current;

        if (!btn || !wrapper) return;

        const xTo = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3.out" });
        const yTo = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3.out" });

        const handleMouseMove = (e: MouseEvent) => {
            const rect = wrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate distance from center
            const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
            const maxDist = Math.max(rect.width, rect.height) / 2;

            if (dist < maxDist) {
                // Move button towards cursor (magnetic effect)
                const moveX = (x - centerX) * 0.3;
                const moveY = (y - centerY) * 0.3;
                xTo(moveX);
                yTo(moveY);
            } else {
                xTo(0);
                yTo(0);
            }
        };

        const handleMouseLeave = () => {
            xTo(0);
            yTo(0);
        };

        wrapper.addEventListener("mousemove", handleMouseMove);
        wrapper.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            wrapper.removeEventListener("mousemove", handleMouseMove);
            wrapper.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return (
        <footer className="footer-section">
            <div className="footer-divider" />

            <div className="footer-logo">AERO</div>
            <div className="footer-tagline">Forged For The Future</div>

            <div ref={wrapperRef} className="magnetic-btn-wrapper">
                <button ref={btnRef} className="magnetic-btn">
                    Start Configuration
                </button>
            </div>

            <div className="footer-links">
                <a href="#" className="footer-link">Lookbook</a>
                <a href="#" className="footer-link">Technology</a>
                <a href="#" className="footer-link">Dealers</a>
                <a href="#" className="footer-link">Contact</a>
            </div>

            <div className="footer-socials">
                <a href="#" className="footer-social-icon" aria-label="Instagram">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                </a>
                <a href="#" className="footer-social-icon" aria-label="Twitter">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4l11.733 16h4.267l-11.733 -16h-4.267z" />
                        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                    </svg>
                </a>
                <a href="#" className="footer-social-icon" aria-label="LinkedIn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                    </svg>
                </a>
                <a href="#" className="footer-social-icon" aria-label="YouTube">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                    </svg>
                </a>
            </div>

            <div className="footer-copyright">
                © 2026 AERO. ALL RIGHTS RESERVED.
            </div>
        </footer>
    );
}
