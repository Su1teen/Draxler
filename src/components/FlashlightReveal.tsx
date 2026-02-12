"use client";

import { useEffect, useRef, CSSProperties } from "react";
/* gsap removed — this component uses pure CSS mask + vanilla JS */


export default function FlashlightReveal() {
    const containerRef = useRef<HTMLDivElement>(null);
    const maskRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current || !maskRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Update CSS variables for the mask position
            maskRef.current.style.setProperty("--mx", `${x}px`);
            maskRef.current.style.setProperty("--my", `${y}px`);
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener("mousemove", handleMouseMove);
        }

        return () => {
            if (container) {
                container.removeEventListener("mousemove", handleMouseMove);
            }
        };
    }, []);

    return (
        <section ref={containerRef} className="flashlight-section">
            <div className="flashlight-texture" />
            <div
                ref={maskRef}
                className="flashlight-mask"
                style={{
                    '--mx': '50%',
                    '--my': '50%'
                } as CSSProperties}
            />

            <div className="flashlight-content">
                <h2 className="flashlight-title">Precision At Every Grain</h2>
                <p className="flashlight-hint">Hover to Inspect Surface Quality</p>
            </div>
        </section>
    );
}
